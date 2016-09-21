let roles = [
  'doctor',
  'patient',
  'caregiver',
  'owner',
  'admin'
];

export default {
  getRoles: function() {
    return roles;
  },

  getAssignableRoles: function(user) {
    if (!user || !user.role) 
      return [];
    else if (user.role.name === 'owner')
      return ['admin'];
    else if (user.role.name === 'admin')
      return roles.filter((role) => { return role !== 'owner'; });
    else
      return [];
  }
}