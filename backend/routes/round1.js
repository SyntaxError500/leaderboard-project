import express from 'express';
import { addTeam,getTeams ,deleteTeam,updateTeam } from '../controllers/round1.js';
const router = express.Router();

router.post('/add', addTeam);
router.get('/teams', getTeams);
router.post('/teams/:id', updateTeam);
router.post('/teams/delete/:id', deleteTeam);

export default router;