export const trending = (req, res) => {
    const videos = [
        {
            title: "First Video",
            rating: 5,
            comments: 2,
            createdAt: "2 minutes ago",
            views: 86,
            id: 1,
        },
        {
            title: "Second Video",
            rating: 5,
            comments: 2,
            createdAt: "2 minutes ago",
            views: 86,
            id: 2,
        },
        {
            title: "Third Video",
            rating: 5,
            comments: 2,
            createdAt: "2 minutes ago",
            views: 86,
            id: 3,
        },
    ];
    res.render("home", { pageTitle: "Home", videos });
};
export const edit = (req, res) => res.render("edit");
export const watch = (req, res) => res.render("watch");
export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("Upload Video");
export const deleteVideo = (req, res) => {
    console.log(req.params);
    res.send("Delete Video");
};
