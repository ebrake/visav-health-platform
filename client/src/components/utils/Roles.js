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

  getAssignableRoles: function() {
    return roles.filter((role) => { return role !== 'owner'; });
  }
}