let roles = [
  { value: 'doctor', label: 'Doctor' },
  { value: 'patient', label: 'Patient' },
  { value: 'caregiver', label: 'Caregiver' },
  { value: 'owner', label: 'Owner' },
  { value: 'admin', label: 'Admin' },
];

export default {
  getRoles: function() {
    return roles;
  },

  getAssignableRoles: function() {
    return roles.filter((role) => { return role.value !== 'owner'; });
  }
}