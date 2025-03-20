
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Edit, Trash2, Plus, Save, X, LogOut, User, Shield, UserCheck } from "lucide-react";
import { supabase } from "../integrations/supabase/client";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Navbar from "../components/Navbar";

// Tipi per i dati
interface Member {
  id: string;
  name: string;
  image: string;
  role: string;
  join_date?: string;
  achievements: string[];
}

interface Game {
  id: string;
  image_url: string;
  replay_url: string;
  tournament: string;
  phase: string;
  format: string;
  players: string;
  description_it: string;
  description_en: string;
}

interface AdminUser {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

interface RegisteredUser {
  id: string;
  email: string;
  created_at: string;
}

const Admin = () => {
  const { user, isAdmin, loading, signOut, checkIsAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [members, setMembers] = useState<Member[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  
  // Stati per la modifica
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [editGame, setEditGame] = useState<Game | null>(null);
  const [achievements, setAchievements] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("members");

  // Carica i dati dal database
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Carica membri
        const { data: membersData, error: membersError } = await supabase
          .from('members')
          .select('*');

        if (membersError) throw membersError;
        setMembers(membersData || []);

        // Carica giochi
        const { data: gamesData, error: gamesError } = await supabase
          .from('best_games')
          .select('*');

        if (gamesError) throw gamesError;
        setGames(gamesData || []);
      } catch (error: any) {
        toast({
          title: "Errore nel caricamento dei dati",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoadingData(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, toast]);

  // Carica gli utenti admin e registrati
  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAdmin) return;
      
      try {
        setLoadingUsers(true);
        
        // Carica la lista degli admin
        const { data: adminData, error: adminError } = await supabase
          .from('admins')
          .select('*')
          .order('created_at', { ascending: false });

        if (adminError) throw adminError;
        setAdminUsers(adminData || []);
        
        // Carica la lista di tutti gli utenti registrati
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) {
          // Se non abbiamo accesso all'API admin, tenteremo di ottenere gli utenti in un altro modo
          console.error("Non è possibile accedere all'API admin:", authError);
          
          // Possiamo ancora visualizzare gli admin esistenti
          const usersFromAdmins = adminData?.map(admin => ({
            id: admin.id,
            email: admin.email,
            created_at: admin.created_at
          })) || [];
          
          setRegisteredUsers(usersFromAdmins);
        } else {
          setRegisteredUsers(authData?.users || []);
        }
      } catch (error: any) {
        console.error("Errore nel caricamento degli utenti:", error);
        toast({
          title: "Errore",
          description: "Impossibile caricare la lista degli utenti",
          variant: "destructive",
        });
      } finally {
        setLoadingUsers(false);
      }
    };
    
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin, toast]);

  // Funzioni di gestione membri
  const handleEditMember = (member: Member) => {
    setEditMember(member);
    setAchievements(member.achievements.join('\n'));
    setDialogOpen(true);
  };

  const handleSaveMember = async () => {
    if (!editMember) return;

    try {
      const achievementsArray = achievements
        .split('\n')
        .map(item => item.trim())
        .filter(item => item !== '');

      const updatedMember = {
        ...editMember,
        achievements: achievementsArray
      };

      // Se stiamo aggiungendo un nuovo membro
      if (editMember.id === 'new') {
        // Rimuovi l'id temporaneo prima di inserire
        const { id, ...newMember } = updatedMember;
        
        const { data, error } = await supabase
          .from('members')
          .insert([newMember])
          .select();

        if (error) throw error;
        
        setMembers(prev => [...prev, data[0]]);
        toast({
          title: "Membro aggiunto",
          description: "Il nuovo membro è stato aggiunto con successo"
        });
      } else {
        // Aggiornamento di un membro esistente
        const { error } = await supabase
          .from('members')
          .update(updatedMember)
          .eq('id', editMember.id);

        if (error) throw error;
        
        setMembers(prev => 
          prev.map(item => item.id === editMember.id ? updatedMember : item)
        );
        toast({
          title: "Membro aggiornato",
          description: "I dati del membro sono stati aggiornati con successo"
        });
      }

      setDialogOpen(false);
      setEditMember(null);
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (window.confirm("Sei sicuro di voler eliminare questo membro?")) {
      try {
        const { error } = await supabase
          .from('members')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        setMembers(prev => prev.filter(member => member.id !== id));
        toast({
          title: "Membro eliminato",
          description: "Il membro è stato eliminato con successo"
        });
      } catch (error: any) {
        toast({
          title: "Errore",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleAddMember = () => {
    const newMember: Member = {
      id: 'new', // ID temporaneo
      name: '',
      image: '',
      role: '',
      join_date: '',
      achievements: []
    };
    setEditMember(newMember);
    setAchievements('');
    setDialogOpen(true);
  };

  // Funzioni di gestione giochi
  const handleEditGame = (game: Game) => {
    setEditGame(game);
    setDialogOpen(true);
  };

  const handleSaveGame = async () => {
    if (!editGame) return;

    try {
      // Se stiamo aggiungendo un nuovo gioco
      if (editGame.id === 'new') {
        // Rimuovi l'id temporaneo prima di inserire
        const { id, ...newGame } = editGame;
        
        const { data, error } = await supabase
          .from('best_games')
          .insert([newGame])
          .select();

        if (error) throw error;
        
        setGames(prev => [...prev, data[0]]);
        toast({
          title: "Gioco aggiunto",
          description: "Il nuovo gioco è stato aggiunto con successo"
        });
      } else {
        // Aggiornamento di un gioco esistente
        const { error } = await supabase
          .from('best_games')
          .update(editGame)
          .eq('id', editGame.id);

        if (error) throw error;
        
        setGames(prev => 
          prev.map(item => item.id === editGame.id ? editGame : item)
        );
        toast({
          title: "Gioco aggiornato",
          description: "I dati del gioco sono stati aggiornati con successo"
        });
      }

      setDialogOpen(false);
      setEditGame(null);
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteGame = async (id: string) => {
    if (window.confirm("Sei sicuro di voler eliminare questo gioco?")) {
      try {
        const { error } = await supabase
          .from('best_games')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        setGames(prev => prev.filter(game => game.id !== id));
        toast({
          title: "Gioco eliminato",
          description: "Il gioco è stato eliminato con successo"
        });
      } catch (error: any) {
        toast({
          title: "Errore",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleAddGame = () => {
    const newGame: Game = {
      id: 'new', // ID temporaneo
      image_url: '',
      replay_url: '',
      tournament: '',
      phase: '',
      format: '',
      players: '',
      description_it: '',
      description_en: ''
    };
    setEditGame(newGame);
    setDialogOpen(true);
  };

  // Funzioni di gestione admin
  const handleToggleAdmin = async (userId: string, email: string, isCurrentAdmin: boolean) => {
    try {
      if (isCurrentAdmin) {
        // Rimuovi admin
        const { error } = await supabase
          .from('admins')
          .update({ is_active: false })
          .eq('id', userId);
          
        if (error) throw error;
        
        // Aggiorna la UI
        setAdminUsers(prev => 
          prev.map(admin => 
            admin.id === userId ? { ...admin, is_active: false } : admin
          )
        );
        
        // Aggiorna isAdmin per l'utente corrente se necessario
        if (userId === user?.id) {
          setTimeout(() => window.location.reload(), 1000);
        }
        
        toast({
          title: "Admin rimosso",
          description: `${email} non è più un amministratore`
        });
      } else {
        // Prima verifica se esiste già un record per questo utente
        const { data: existingAdmin, error: checkError } = await supabase
          .from('admins')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
          
        if (checkError) throw checkError;
        
        if (existingAdmin) {
          // Se esiste, riattiva
          const { error } = await supabase
            .from('admins')
            .update({ is_active: true })
            .eq('id', userId);
            
          if (error) throw error;
        } else {
          // Altrimenti crea nuovo
          const { error } = await supabase
            .from('admins')
            .insert([{ id: userId, email, is_active: true }]);
            
          if (error) throw error;
        }
        
        // Aggiorna la UI
        const { data: adminData, error: refreshError } = await supabase
          .from('admins')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (refreshError) throw refreshError;
        
        setAdminUsers(adminData || []);
        
        toast({
          title: "Admin aggiunto",
          description: `${email} è ora un amministratore`
        });
      }
    } catch (error: any) {
      console.error("Errore nella gestione admin:", error);
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore",
        variant: "destructive",
      });
    }
  };

  // Se sta caricando, mostra un messaggio di caricamento
  if (loading) {
    return (
      <div className="min-h-screen bg-jf-dark text-white flex items-center justify-center">
        <p>Caricamento...</p>
      </div>
    );
  }

  // Se l'utente non è autenticato o non è un admin, reindirizza alla pagina di login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-jf-dark text-white">
      <Navbar />
      
      <div className="pt-32 pb-24 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl md:text-4xl font-display font-bold"
            >
              Dashboard <span className="text-[#D946EF]">Admin</span>
            </motion.h1>
            
            <Button 
              variant="ghost" 
              className="text-white hover:text-[#D946EF]"
              onClick={async () => {
                await signOut();
                navigate('/');
              }}
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
          
          {!isAdmin ? (
            <div className="bg-black/20 rounded-lg border border-white/10 p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">Accesso non autorizzato</h2>
              <p className="mb-4">
                Il tuo account non ha i permessi di amministratore. Solo gli amministratori autorizzati 
                possono gestire i contenuti.
              </p>
              <p>
                Contatta l'amministratore del sito per richiedere l'accesso. Puoi continuare a navigare
                sul sito utilizzando il menu di navigazione.
              </p>
            </div>
          ) : (
            <Tabs defaultValue="members" onValueChange={setCurrentTab}>
              <TabsList className="mb-8 bg-jf-dark/50 border border-white/10">
                <TabsTrigger value="members">Membri</TabsTrigger>
                <TabsTrigger value="games">Best Games</TabsTrigger>
                <TabsTrigger value="admins">Gestione Amministratori</TabsTrigger>
              </TabsList>
              
              <TabsContent value="members">
                <div className="mb-6 flex justify-end">
                  <Button 
                    className="bg-[#D946EF] hover:bg-[#D946EF]/90"
                    onClick={handleAddMember}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Aggiungi Membro
                  </Button>
                </div>
                
                {loadingData ? (
                  <p>Caricamento membri...</p>
                ) : (
                  <div className="space-y-6">
                    {members.map(member => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-black/20 rounded-lg border border-white/10 p-4 flex flex-col md:flex-row gap-4"
                      >
                        <div className="md:w-1/4">
                          <img 
                            src={member.image} 
                            alt={member.name}
                            className="w-full h-auto rounded-md"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-xl font-bold">{member.name}</h3>
                          <p className="text-[#D946EF] mb-2">{member.role}</p>
                          {member.join_date && (
                            <p className="text-gray-400 text-sm mb-2">Iscritto dal: {member.join_date}</p>
                          )}
                          
                          <h4 className="font-semibold mb-1">Achievements:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {member.achievements.map((achievement, index) => (
                              <li key={index}>{achievement}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex md:flex-col gap-2 justify-end">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleEditMember(member)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="text-red-500 hover:text-red-300"
                            onClick={() => handleDeleteMember(member.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="games">
                <div className="mb-6 flex justify-end">
                  <Button 
                    className="bg-[#D946EF] hover:bg-[#D946EF]/90"
                    onClick={handleAddGame}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Aggiungi Best Game
                  </Button>
                </div>
                
                {loadingData ? (
                  <p>Caricamento games...</p>
                ) : (
                  <div className="space-y-8">
                    {games.map(game => (
                      <motion.div
                        key={game.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-black/20 rounded-lg border border-white/10 p-4 flex flex-col md:flex-row gap-4"
                      >
                        <div className="md:w-1/3">
                          <img 
                            src={game.image_url} 
                            alt={game.players}
                            className="w-full h-auto rounded-md"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="inline-block px-3 py-1 bg-jf-blue/20 text-jf-blue rounded-full text-sm font-medium">
                              {game.tournament}
                            </span>
                            <span className="inline-block px-3 py-1 bg-[#D946EF]/20 text-[#D946EF] rounded-full text-sm font-medium">
                              {game.phase}
                            </span>
                            <span className="inline-block px-3 py-1 bg-jf-purple/20 text-jf-purple rounded-full text-sm font-medium">
                              {game.format}
                            </span>
                          </div>
                          
                          <h3 className="text-xl font-bold mb-2">{game.players}</h3>
                          
                          <h4 className="font-semibold mb-1">Descrizione (IT):</h4>
                          <p className="text-gray-300 mb-2">{game.description_it}</p>
                          
                          <h4 className="font-semibold mb-1">Descrizione (EN):</h4>
                          <p className="text-gray-300 mb-2">{game.description_en}</p>
                          
                          <a 
                            href={game.replay_url} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#D946EF] hover:underline"
                          >
                            Link al replay
                          </a>
                        </div>
                        
                        <div className="flex md:flex-col gap-2 justify-end">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleEditGame(game)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="text-red-500 hover:text-red-300"
                            onClick={() => handleDeleteGame(game.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="admins">
                <div className="mb-8 bg-black/20 rounded-lg border border-white/10 p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-[#D946EF]" />
                    Gestione Amministratori
                  </h2>
                  <p className="text-gray-300 mb-4">
                    Da qui puoi gestire chi ha accesso amministrativo al sito. Solo gli amministratori possono 
                    modificare i contenuti del sito come membri e best games.
                  </p>
                  <p className="text-gray-300">
                    Per aggiungere un amministratore, l'utente deve prima registrarsi al sito, poi potrai 
                    assegnargli i permessi da questa pagina.
                  </p>
                </div>
                
                {loadingUsers ? (
                  <p>Caricamento utenti...</p>
                ) : (
                  <div className="space-y-8">
                    <div className="bg-black/20 rounded-lg border border-white/10 overflow-hidden">
                      <div className="p-4 bg-black/40 border-b border-white/10">
                        <h3 className="font-semibold">Utenti Registrati</h3>
                      </div>
                      <div className="divide-y divide-white/10">
                        {registeredUsers.length === 0 ? (
                          <p className="p-4 text-gray-400">Nessun utente registrato trovato.</p>
                        ) : (
                          registeredUsers.map(regUser => {
                            // Trova se l'utente è admin e se è attivo
                            const adminInfo = adminUsers.find(admin => admin.id === regUser.id);
                            const isActiveAdmin = adminInfo?.is_active || false;
                            
                            return (
                              <div key={regUser.id} className="p-4 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <User className="h-5 w-5 text-gray-400" />
                                  <div>
                                    <p className="font-medium">{regUser.email}</p>
                                    <p className="text-xs text-gray-400">
                                      ID: {regUser.id.substring(0, 8)}...
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center">
                                    <Switch 
                                      checked={isActiveAdmin}
                                      onCheckedChange={() => handleToggleAdmin(regUser.id, regUser.email, isActiveAdmin)}
                                      disabled={regUser.id === user?.id} // Non permettere di rimuovere se stessi
                                    />
                                    <span className="ml-2">
                                      {isActiveAdmin ? (
                                        <span className="text-green-400 flex items-center">
                                          <UserCheck className="h-4 w-4 mr-1" />
                                          Admin
                                        </span>
                                      ) : "Utente"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
      
      {/* Dialog per la modifica dei membri */}
      {editMember && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-jf-dark text-white border border-white/10 md:max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editMember.id === 'new' ? 'Aggiungi Membro' : `Modifica ${editMember.name}`}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={editMember.name}
                    onChange={(e) => setEditMember({...editMember, name: e.target.value})}
                    className="bg-black/50 border-white/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image">URL Immagine</Label>
                  <Input
                    id="image"
                    value={editMember.image}
                    onChange={(e) => setEditMember({...editMember, image: e.target.value})}
                    className="bg-black/50 border-white/20"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Ruolo</Label>
                  <Input
                    id="role"
                    value={editMember.role}
                    onChange={(e) => setEditMember({...editMember, role: e.target.value})}
                    className="bg-black/50 border-white/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="join_date">Data iscrizione</Label>
                  <Input
                    id="join_date"
                    value={editMember.join_date || ''}
                    onChange={(e) => setEditMember({...editMember, join_date: e.target.value})}
                    className="bg-black/50 border-white/20"
                    placeholder="e.g. September 2015"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="achievements">
                  Achievements (uno per riga)
                </Label>
                <Textarea
                  id="achievements"
                  value={achievements}
                  onChange={(e) => setAchievements(e.target.value)}
                  rows={5}
                  className="bg-black/50 border-white/20"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                  setEditMember(null);
                }}
              >
                <X className="mr-2 h-4 w-4" /> Annulla
              </Button>
              
              <Button 
                className="bg-[#D946EF] hover:bg-[#D946EF]/90"
                onClick={handleSaveMember}
              >
                <Save className="mr-2 h-4 w-4" /> Salva
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Dialog per la modifica dei giochi */}
      {editGame && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-jf-dark text-white border border-white/10 md:max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editGame.id === 'new' ? 'Aggiungi Best Game' : `Modifica ${editGame.players}`}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="players">Giocatori</Label>
                  <Input
                    id="players"
                    value={editGame.players}
                    onChange={(e) => setEditGame({...editGame, players: e.target.value})}
                    className="bg-black/50 border-white/20"
                    placeholder="e.g. Player1 vs Player2"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image_url">URL Immagine</Label>
                  <Input
                    id="image_url"
                    value={editGame.image_url}
                    onChange={(e) => setEditGame({...editGame, image_url: e.target.value})}
                    className="bg-black/50 border-white/20"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tournament">Torneo</Label>
                  <Input
                    id="tournament"
                    value={editGame.tournament}
                    onChange={(e) => setEditGame({...editGame, tournament: e.target.value})}
                    className="bg-black/50 border-white/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phase">Fase</Label>
                  <Input
                    id="phase"
                    value={editGame.phase}
                    onChange={(e) => setEditGame({...editGame, phase: e.target.value})}
                    className="bg-black/50 border-white/20"
                    placeholder="e.g. Finals"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="format">Formato</Label>
                  <Input
                    id="format"
                    value={editGame.format}
                    onChange={(e) => setEditGame({...editGame, format: e.target.value})}
                    className="bg-black/50 border-white/20"
                    placeholder="e.g. Gen 9 OU"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="replay_url">URL Replay</Label>
                  <Input
                    id="replay_url"
                    value={editGame.replay_url}
                    onChange={(e) => setEditGame({...editGame, replay_url: e.target.value})}
                    className="bg-black/50 border-white/20"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description_it">Descrizione (IT)</Label>
                <Textarea
                  id="description_it"
                  value={editGame.description_it}
                  onChange={(e) => setEditGame({...editGame, description_it: e.target.value})}
                  rows={3}
                  className="bg-black/50 border-white/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description_en">Descrizione (EN)</Label>
                <Textarea
                  id="description_en"
                  value={editGame.description_en}
                  onChange={(e) => setEditGame({...editGame, description_en: e.target.value})}
                  rows={3}
                  className="bg-black/50 border-white/20"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                  setEditGame(null);
                }}
              >
                <X className="mr-2 h-4 w-4" /> Annulla
              </Button>
              
              <Button 
                className="bg-[#D946EF] hover:bg-[#D946EF]/90"
                onClick={handleSaveGame}
              >
                <Save className="mr-2 h-4 w-4" /> Salva
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Admin;
