export const trending = (req, res) => res.render("home");
export const edit = (req, res) => res.send("Edit Videos");
export const watch = (req, res) => res.send("Watch Video");
export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("Upload Video");
export const deleteVideo = (req, res) => {
    console.log(req.params);
    res.send("Delete Video");
};
