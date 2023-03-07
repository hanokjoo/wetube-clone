export const trending = (req, res) => res.send("Home Page Videos");
export const edit = (req, res) => res.send("Edit Videos");
export const see = (req, res) => res.send("See Videos");
export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("Upload Video");
export const deleteVideo = (req, res) => {
    console.log(req.params);
    res.send("Delete Video");
};
