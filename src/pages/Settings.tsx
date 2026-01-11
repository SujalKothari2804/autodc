import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Plus, Pencil, Trash2, Key, Users, MapPin, Settings as SettingsIcon, Palette, Upload } from 'lucide-react';
import { User, Site } from '@/data/types';
import { toast } from 'sonner';

export default function Settings() {
  const { state, dispatch } = useApp();
  const { theme } = useTheme();
  
  // User Management
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'viewer' as User['role'] });
  
  // Site Management
  const [isSiteModalOpen, setIsSiteModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [siteForm, setSiteForm] = useState({ 
    name: '', 
    address: '', 
    type: 'commercial' as Site['type'],
    lat: '',
    lng: '',
  });

  // API Key
  const [apiKey, setApiKey] = useState(state.settings.aiApiKey || '');

  // User handlers
  const handleSaveUser = () => {
    if (!userForm.name || !userForm.email) {
      toast.error('Please fill in all fields');
      return;
    }

    if (editingUser) {
      dispatch({
        type: 'UPDATE_USER',
        payload: { ...editingUser, ...userForm },
      });
      toast.success('User updated');
    } else {
      const newUser: User = {
        id: `user-${Date.now()}`,
        ...userForm,
      };
      dispatch({ type: 'ADD_USER', payload: newUser });
      toast.success('User added');
    }
    
    setIsUserModalOpen(false);
    setEditingUser(null);
    setUserForm({ name: '', email: '', role: 'viewer' });
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({ name: user.name, email: user.email, role: user.role });
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    dispatch({ type: 'DELETE_USER', payload: userId });
    toast.success('User removed');
  };

  // Site handlers
  const handleSaveSite = () => {
    if (!siteForm.name || !siteForm.address) {
      toast.error('Please fill in all fields');
      return;
    }

    if (editingSite) {
      dispatch({
        type: 'UPDATE_SITE',
        payload: { 
          ...editingSite, 
          name: siteForm.name,
          address: siteForm.address,
          type: siteForm.type,
          location: {
            lat: parseFloat(siteForm.lat) || editingSite.location.lat,
            lng: parseFloat(siteForm.lng) || editingSite.location.lng,
          },
        },
      });
      toast.success('Site updated');
    } else {
      const newSite: Site = {
        id: `site-${Date.now()}`,
        name: siteForm.name,
        address: siteForm.address,
        type: siteForm.type,
        location: {
          lat: parseFloat(siteForm.lat) || 37.7749,
          lng: parseFloat(siteForm.lng) || -122.4194,
        },
      };
      dispatch({ type: 'ADD_SITE', payload: newSite });
      toast.success('Site added');
    }
    
    setIsSiteModalOpen(false);
    setEditingSite(null);
    setSiteForm({ name: '', address: '', type: 'commercial', lat: '', lng: '' });
  };

  const handleEditSite = (site: Site) => {
    setEditingSite(site);
    setSiteForm({ 
      name: site.name, 
      address: site.address, 
      type: site.type,
      lat: site.location.lat.toString(),
      lng: site.location.lng.toString(),
    });
    setIsSiteModalOpen(true);
  };

  const handleDeleteSite = (siteId: string) => {
    dispatch({ type: 'DELETE_SITE', payload: siteId });
    toast.success('Site removed');
  };

  // API Key handler
  const handleSaveApiKey = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { aiApiKey: apiKey } });
    toast.success('API key saved');
  };

  const handleRevokeApiKey = () => {
    setApiKey('');
    dispatch({ type: 'UPDATE_SETTINGS', payload: { aiApiKey: '' } });
    toast.success('API key revoked');
  };

  const getRoleBadge = (role: User['role']) => {
    const styles = {
      admin: 'badge-active',
      operator: 'badge-warning',
      viewer: 'badge-muted',
    };
    return <span className={styles[role]}>{role.charAt(0).toUpperCase() + role.slice(1)}</span>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage users, sites, and system configuration</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <SettingsIcon className="w-4 h-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="appearance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Palette className="w-4 h-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="sites" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <MapPin className="w-4 h-4 mr-2" />
              Sites
            </TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Key className="w-4 h-4 mr-2" />
              API Keys
            </TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general">
            <div className="bg-card border border-border rounded-lg p-6 max-w-xl space-y-6">
              <h3 className="font-semibold text-foreground">System Preferences</h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive alerts for mission events</p>
                </div>
                <Switch
                  checked={state.settings.notificationsEnabled}
                  onCheckedChange={(checked) => 
                    dispatch({ type: 'UPDATE_SETTINGS', payload: { notificationsEnabled: checked } })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Auto-Schedule</p>
                  <p className="text-sm text-muted-foreground">Automatically schedule routine missions</p>
                </div>
                <Switch
                  checked={state.settings.autoScheduleEnabled}
                  onCheckedChange={(checked) => 
                    dispatch({ type: 'UPDATE_SETTINGS', payload: { autoScheduleEnabled: checked } })
                  }
                />
              </div>
            </div>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <div className="space-y-6 max-w-xl">
              <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                <h3 className="font-semibold text-foreground">Theme</h3>
                <p className="text-sm text-muted-foreground">
                  Choose between OPS Mode for operations and monitoring, or BIZ Mode for reports and analytics.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Current Mode</p>
                      <p className="text-sm text-muted-foreground">
                        {theme === 'ops' ? 'Operations Mode - Neon Cyan' : 'Business Mode - Enterprise Blue'}
                      </p>
                    </div>
                    <ThemeSwitcher variant="toggle" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="p-4 rounded-lg border border-border bg-secondary/30">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 rounded-full" style={{ background: 'hsl(180 100% 50%)' }} />
                        <p className="font-medium text-foreground text-sm">OPS Mode</p>
                      </div>
                      <p className="text-xs text-muted-foreground">High-contrast neon cyan for mission-critical operations, monitoring, and live tracking.</p>
                    </div>
                    <div className="p-4 rounded-lg border border-border bg-secondary/30">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 rounded-full" style={{ background: 'hsl(217 91% 60%)' }} />
                        <p className="font-medium text-foreground text-sm">BIZ Mode</p>
                      </div>
                      <p className="text-xs text-muted-foreground">Corporate enterprise blue for reports, analytics, and executive dashboards.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                <h3 className="font-semibold text-foreground">Branding</h3>
                <p className="text-sm text-muted-foreground">
                  Customize your AutoDC instance with your organization's logo.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <Label>Logo Upload</Label>
                    <p className="text-xs text-muted-foreground mb-3">Upload a custom logo to replace the default AutoDC logo.</p>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-secondary/30">
                        <Upload className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <Button variant="secondary" size="sm" disabled>
                          Upload Logo
                        </Button>
                        <p className="text-xs text-muted-foreground">PNG, SVG up to 2MB (Coming soon)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="bg-card border border-border rounded-lg">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Team Members</h3>
                <Button onClick={() => setIsUserModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
              <table className="data-table">
                <thead className="bg-secondary/50">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {state.users.map(user => (
                    <tr key={user.id}>
                      <td className="font-medium text-foreground">{user.name}</td>
                      <td className="text-muted-foreground">{user.email}</td>
                      <td>{getRoleBadge(user.role)}</td>
                      <td>
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary" onClick={() => handleEditUser(user)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(user.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Sites Tab */}
          <TabsContent value="sites">
            <div className="bg-card border border-border rounded-lg">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Operation Sites</h3>
                <Button onClick={() => setIsSiteModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Site
                </Button>
              </div>
              <table className="data-table">
                <thead className="bg-secondary/50">
                  <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Type</th>
                    <th>Coordinates</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {state.sites.map(site => (
                    <tr key={site.id}>
                      <td className="font-medium text-foreground">{site.name}</td>
                      <td className="text-muted-foreground">{site.address}</td>
                      <td><span className="badge-muted capitalize">{site.type}</span></td>
                      <td className="text-muted-foreground text-xs font-mono">
                        {site.location.lat.toFixed(4)}, {site.location.lng.toFixed(4)}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary" onClick={() => handleEditSite(site)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteSite(site.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api">
            <div className="bg-card border border-border rounded-lg p-6 max-w-xl">
              <h3 className="font-semibold text-foreground mb-4">AI API Key Configuration</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Enter your OpenAI, Anthropic, or compatible API key to enable AI-powered features.
              </p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <Input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                  />
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleSaveApiKey}>Save API Key</Button>
                  {state.settings.aiApiKey && (
                    <Button variant="destructive" onClick={handleRevokeApiKey}>
                      Revoke
                    </Button>
                  )}
                </div>
                {state.settings.aiApiKey && (
                  <p className="text-sm text-primary flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    API key is configured
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* User Modal */}
        <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Edit User' : 'Add User'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={userForm.role}
                  onValueChange={(value) => setUserForm({ ...userForm, role: value as User['role'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="operator">Operator</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setIsUserModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveUser}>{editingUser ? 'Save Changes' : 'Add User'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Site Modal */}
        <Dialog open={isSiteModalOpen} onOpenChange={setIsSiteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSite ? 'Edit Site' : 'Add Site'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Site Name</Label>
                <Input
                  value={siteForm.name}
                  onChange={(e) => setSiteForm({ ...siteForm, name: e.target.value })}
                  placeholder="e.g., Downtown Hub"
                />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  value={siteForm.address}
                  onChange={(e) => setSiteForm({ ...siteForm, address: e.target.value })}
                  placeholder="123 Main St, City, State"
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={siteForm.type}
                  onValueChange={(value) => setSiteForm({ ...siteForm, type: value as Site['type'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="infrastructure">Infrastructure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Latitude</Label>
                  <Input
                    value={siteForm.lat}
                    onChange={(e) => setSiteForm({ ...siteForm, lat: e.target.value })}
                    placeholder="37.7749"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Longitude</Label>
                  <Input
                    value={siteForm.lng}
                    onChange={(e) => setSiteForm({ ...siteForm, lng: e.target.value })}
                    placeholder="-122.4194"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setIsSiteModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveSite}>{editingSite ? 'Save Changes' : 'Add Site'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
