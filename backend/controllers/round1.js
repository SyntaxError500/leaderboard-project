import roundModel from "../models/roundModel.js";


const addTeam = async (req, res) => {
    try {
        const { name, college, round1,round2,round3} = req.body;
        console.log(name, college,round1,round2,round3);
        const newTeam = new roundModel({ name, college, round1,round2,round3});
        await newTeam.save();
        res.status(201).json({ message: "Team added successfully", team: newTeam });
    } catch (error) {
        res.status(500).json({ message: "Error adding team", error });
    }
};
const getTeams = async (req, res) => {
    try {
        const teams = await roundModel.find();
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ message: "Error fetching teams", error });
    }
};


const updateTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, college, round1,round2,round3} = req.body;
        const updatedTeam = await roundModel.findByIdAndUpdate(id, { name, college, round1,round2,round3}, { new: true });
        if (!updatedTeam) {
            return res.status(404).json({ message: "Team not found" });
        }
        res.status(200).json({ message: "Team updated successfully", team: updatedTeam });
    } catch (error) {
        res.status(500).json({ message: "Error updating team", error });
    }
};

const deleteTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTeam = await roundModel.findByIdAndDelete(id);
        if (!deletedTeam) {
            return res.status(404).json({ message: "Team not found" });
        }
        res.status(200).json({ message: "Team deleted successfully", team: deletedTeam });
    } catch (error) {
        res.status(500).json({ message: "Error deleting team", error });
    }
};


export { addTeam, getTeams, updateTeam, deleteTeam };