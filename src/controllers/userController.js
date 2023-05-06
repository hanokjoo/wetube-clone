import User from "../models/User";
import Video from "../models/Video";
import bycryt from "bcrypt";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
    const { email, username, password, password2, name, location } = req.body;
    const pageTitle = "Join";
    if (password !== password2) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "Password confirmation does not match.",
        });
    }
    const exists = await User.exists({ $or: [{ username }, { email }] });
    if (exists) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "This username/email is already taken.",
        });
    }
    try {
        await User.create({
            email,
            username,
            password,
            name,
            location,
        });
        res.redirect("/login");
    } catch (error) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: error._message,
        });
    }
};
export const getLogin = (req, res) =>
    res.render("login", { pageTitle: "Login" });
export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const pageTitle = "Login";
    const user = await User.findOne({ username, socialOnly: false });
    if (!user) {
        return res.status(400).render("login", {
            pageTitle,
            errorMessage: "An account with this username does not exists.",
        });
    }
    const ok = await bycryt.compare(password, user.password);
    if (!ok) {
        return res.status(400).render("login", {
            pageTitle,
            errorMessage: "Wrong password.",
        });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
};
export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email",
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};
export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (
        await fetch(finalUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        })
    ).json();
    if ("access_token" in tokenRequest) {
        const { access_token } = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userData = await (
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            })
        ).json();
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            })
        ).json();
        console.log(userData);
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true
        );
        if (!emailObj) {
            return res.redirect("/login");
        }
        let user = await User.findOne({ email: emailObj.email });
        if (!user) {
            user = await User.create({
                email: emailObj.email,
                username: userData.login,
                socialOnly: true,
                password: "",
                name: userData.name ? userData.name : "Unknown",
                location: userData.location,
                avatarUrl: userData.avatar_url,
            });
        }
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    } else {
        return res.redirect("/login");
    }
};
export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};
export const getEdit = (req, res) => {
    return res.render("edit-profile", { pageTitle: "Edit Profile" });
};
export const postEdit = async (req, res) => {
    const pageTitle = "Edit Profile";
    const {
        session: {
            user: { _id, avatarUrl },
        },
        body: { username, email, name, location },
        file,
    } = req;

    if (req.session.user.email !== email) {
        return res.status(400).render("edit-profile", {
            pageTitle,
            errorMessage: "You can't change your email.",
        });
    }

    if (req.session.user.username !== username) {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).render("edit-profile", {
                pageTitle,
                errorMessage: "This username is already taken.",
            });
        }
    }

    const updateUser = await User.findByIdAndUpdate(
        _id,
        {
            username,
            name,
            email,
            location,
            avatarUrl: file ? `/${file.path}` : avatarUrl,
        },
        { new: true }
    );
    req.session.user = updateUser;
    /* req.session.user = {
        ...req.session.user,
        username,
        name,
        email,
        location,
    }; */
    return res.redirect("/users/edit");
};
export const getChangePassword = (req, res) => {
    if (req.session.user.socialOnly) {
        return res.redirect("/");
    }
    return res.render("users/change-password", {
        pageTitle: "Change Password",
    });
};
export const postChagePassword = async (req, res) => {
    const {
        session: {
            user: { _id },
        },
        body: { oldPassword, newPassword, newPasswordConfirmation },
    } = req;
    if (oldPassword === newPassword) {
        return res.status(400).render("users/change-password", {
            pageTitle: "Change Password",
            errorMessage:
                "The old password must be different from the new password.",
        });
    }
    const user = await User.findById(_id);
    const ok = await bycryt.compare(oldPassword, user.password);
    if (!ok) {
        return res.status(400).render("users/change-password", {
            pageTitle: "Change Password",
            errorMessage: "The current password is incorrect.",
        });
    }
    if (newPassword !== newPasswordConfirmation) {
        return res.status(400).render("users/change-password", {
            pageTitle: "Change Password",
            errorMessage: "The password does not match confirmation.",
        });
    }
    user.password = newPassword;
    await user.save(); // pre("save")로 password hash해주기 위해 findByIdAndUpdate() 대신 save()을 사용한다.
    /* 변경 후 login 유지할 때는 필요함. logout하면 session이 destroy 될 것이므로 update할 필요 없음. */
    //req.session.user.password = user.password;
    return res.redirect("/users/logout");
};
export const see = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        return res.status(400).render("404", { pageTitle: "User not found." });
    }
    const videos = await Video.find({ owner: user._id });
    console.log(videos);
    return res.render("users/profile", {
        pageTitle: `${user.name}`,
        user,
        videos,
    });
};
