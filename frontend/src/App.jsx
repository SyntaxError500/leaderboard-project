import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Users, Star, Plus, Edit2, Trash2, Save, X, Settings, AlertCircle } from 'lucide-react';
import axios from 'axios';
import Footer from './components/Footer';


const App = () => {
  const [activeRound, setActiveRound] = useState('round1');
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newTeam, setNewTeam] = useState({
    name: '',
    college: '',
    round1: 0,
    round2: 0,
    round3: 0
  });

  const API_BASE_URL = 'https://leaderboard-project-rose.vercel.app/api/round1';

  const fetchTeams = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/teams`);
      setTeams(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setError('Failed to fetch teams. Please check your backend connection.');
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const addTeam = async () => {
    if (!newTeam.name.trim() || !newTeam.college.trim()) {
      setError('Team name and college are required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/add`, newTeam);
      if (response.status !== 201) throw new Error(`HTTP error! status: ${response.status}`);
      const addedTeam = response.data;
      setTeams(prev => [...prev, addedTeam]);
      setNewTeam({ name: '', college: '', round1: 0, round2: 0, round3: 0 });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding team:', error);
      setError('Failed to add team. Please try again.');
    } finally {
      setLoading(false);
    }
    fetchTeams();
  };

  const updateTeam = async (teamId, updatedData) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/teams/${teamId}`, updatedData);
      if (response.status !== 200) throw new Error(`HTTP error! status: ${response.status}`);
      const updatedTeam = response.data;
      setTeams(prev => prev.map(team => team.id === teamId ? updatedTeam : team));
      setEditingTeam(null);
    } catch (error) {
      console.error('Error updating team:', error);
      setError('Failed to update team. Please try again.');
    } finally {
      setLoading(false);
    }
    fetchTeams();
  };

  const removeTeam = async (teamId) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/teams/delete/${teamId}`);
      if (response.status !== 200) throw new Error(`HTTP error! status: ${response.status}`);
      setTeams(prev => prev.filter(team => team._id !== teamId));
    } catch (error) {
      console.error('Error deleting team:', error);
      setError('Failed to delete team. Please try again.');
    } finally {
      setLoading(false);
    }
    fetchTeams();
  };

  useEffect(() => { fetchTeams(); }, []);

  const getSortedTeams = () => [...teams].sort((a, b) => (b[activeRound] || 0) - (a[activeRound] || 0));

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <div className="w-6 h-6 flex items-center justify-center bg-blue-100 rounded-full text-blue-800 font-bold text-sm">{rank}</div>;
    }
  };

  const getRankBgColor = (rank) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-500';
      case 2: return 'bg-gradient-to-r from-gray-50 to-gray-100 border-l-4 border-gray-400';
      case 3: return 'bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-600';
      default: return 'bg-white hover:bg-gray-50 border-l-4 border-transparent';
    }
  };

  const roundTitles = { round1: 'Round 1', round2: 'Round 2', round3: 'Round 3' };

  const handleEditSubmit = (e, teamId) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = {
      name: formData.get('name'),
      college: formData.get('college'),
      round1: Number(formData.get('round1')) || 0,
      round2: Number(formData.get('round2')) || 0,
      round3: Number(formData.get('round3')) || 0
    };
    updateTeam(teamId, updatedData);
    
  };

  const sortedTeams = getSortedTeams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">NSS Competition Leaderboard</h1>
            <p className="text-blue-100">National Service Scheme - Not me but You</p>
          </div>
          <div className="flex space-x-4">
            <button onClick={fetchTeams} disabled={loading} className="px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg">
              {loading ? 'Loading...' : 'Refresh'}
            </button>
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${showAdmin ? 'bg-white text-blue-600 hover:bg-gray-100' : 'bg-blue-500 hover:bg-blue-400 text-white'}`}
            >
              <Settings className="w-4 h-4" />
              <span>{showAdmin ? 'Exit Admin' : 'Admin Mode'}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-center space-x-2 mb-6">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
            <button onClick={() => setError('')} className="ml-auto text-red-600 hover:text-red-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Round Selection */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Competition Rounds</h2>
          <div className="flex gap-4">
            {Object.entries(roundTitles).map(([key, title]) => (
              <button
                key={key}
                onClick={() => setActiveRound(key)}
                className={`px-6 py-3 rounded-lg ${activeRound === key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {title}
              </button>
            ))}
          </div>
        </div>

        {/* Admin Controls */}
        {showAdmin && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold">Admin Controls</h3>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center space-x-2 hover:bg-green-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add Team</span>
              </button>
            </div>

            {showAddForm && (
              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold mb-4">Add New Team</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <input type="text" placeholder="Team Name" value={newTeam.name} onChange={(e) => setNewTeam({...newTeam, name: e.target.value})} className="px-3 py-2 border rounded-lg" />
                  <input type="text" placeholder="College" value={newTeam.college} onChange={(e) => setNewTeam({...newTeam, college: e.target.value})} className="px-3 py-2 border rounded-lg" />
                  <input type="number" placeholder="Round 1 Points" value={newTeam.round1} onChange={(e) => setNewTeam({...newTeam, round1: +e.target.value || 0})} className="px-3 py-2 border rounded-lg" />
                  <input type="number" placeholder="Round 2 Points" value={newTeam.round2} onChange={(e) => setNewTeam({...newTeam, round2: +e.target.value || 0})} className="px-3 py-2 border rounded-lg" />
                  <input type="number" placeholder="Round 3 Points" value={newTeam.round3} onChange={(e) => setNewTeam({...newTeam, round3: +e.target.value || 0})} className="px-3 py-2 border rounded-lg" />
                </div>
                <div className="flex space-x-2 mt-4">
                  <button onClick={addTeam} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{loading ? 'Adding...' : 'Add Team'}</button>
                  <button onClick={() => { setShowAddForm(false); setNewTeam({ name: '', college: '', round1: 0, round2: 0, round3: 0 }); }} className="px-4 py-2 border rounded-lg">Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
            <h2 className="text-2xl font-bold">{roundTitles[activeRound]}</h2>
            <p className="text-gray-600">Current standings and team performance</p>
          </div>

          <div className="p-6">
            {loading && teams.length === 0 ? (
              <p className="text-center">Loading teams...</p>
            ) : sortedTeams.length === 0 ? (
              <p className="text-center">No teams found. {showAdmin && 'Add some teams to get started!'}</p>
            ) : (
              <div className="space-y-4">
                {sortedTeams.map((team, index) => {
                  const rank = index + 1;
                  const isEditing = editingTeam === team.id;

                  return (
                    <div key={team.id} className={`p-6 rounded-lg shadow-md ${getRankBgColor(rank)}`}>
                      {isEditing ? (
                        <form onSubmit={(e) => handleEditSubmit(e, team._id)} className="space-y-4">
                          <div className="flex space-x-4">
                            <div className="flex-shrink-0">{getRankIcon(rank)}</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                              <input name="name" defaultValue={team.name} required className="px-3 py-2 border rounded-lg" />
                              <input name="college" defaultValue={team.college} required className="px-3 py-2 border rounded-lg" />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <input name="round1" type="number" defaultValue={team.round1 || 0} className="px-3 py-2 border rounded-lg" />
                            <input name="round2" type="number" defaultValue={team.round2 || 0} className="px-3 py-2 border rounded-lg" />
                            <input name="round3" type="number" defaultValue={team.round3 || 0} className="px-3 py-2 border rounded-lg" />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <button type="submit" disabled={loading} className="px-3 py-2 bg-green-600 text-white rounded-lg flex items-center"><Save className="w-4 h-4 mr-1" />{loading ? 'Saving...' : 'Save'}</button>
                            <button type="button" onClick={() => setEditingTeam(null)} className="px-3 py-2 border rounded-lg flex items-center"><X className="w-4 h-4 mr-1" />Cancel</button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex justify-between">
                          <div className="flex space-x-4">
                            <div className="flex-shrink-0">{getRankIcon(rank)}</div>
                            <div>
                              <h3 className="text-xl font-bold">{team.name}</h3>
                              <p className="text-gray-600">{team.college}</p>
                              <div className="flex space-x-4 text-sm text-gray-500">
                                <span>R1: {team.round1 || 0}</span>
                                <span>R2: {team.round2 || 0}</span>
                                <span>R3: {team.round3 || 0}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-4 items-center">
                            <div className="text-right">
                              <div className="text-3xl font-bold text-blue-600">{team[activeRound] || 0}</div>
                              <div className="text-sm text-gray-500">points</div>
                            </div>
                            {showAdmin && (
                              <div className="flex flex-col space-y-2">
                                <button onClick={() => setEditingTeam(team.id)} disabled={loading} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                                <button onClick={() => removeTeam(team._id)} disabled={loading} className="p-2 text-red-600 hover:bg-red-100 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg text-center shadow-lg">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold">Total Teams</h3>
            <p className="text-3xl font-bold text-blue-600">{teams.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg text-center shadow-lg">
            <Award className="w-8 h-8 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold">Top Score</h3>
            <p className="text-3xl font-bold text-green-600">{sortedTeams.length ? sortedTeams[0][activeRound] || 0 : 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg text-center shadow-lg">
            <Star className="w-8 h-8 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold">Average Score</h3>
            <p className="text-3xl font-bold text-purple-600">{teams.length ? Math.round(teams.reduce((sum, team) => sum + (team[activeRound] || 0), 0) / teams.length) : 0}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
