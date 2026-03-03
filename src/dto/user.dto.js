const mapUser = (row) => {
  if (!row) return null;
  return {
    user_id: row.user_id,
    user_fullname: row.user_fullname,
    user_email: row.user_email,
    user_role: row.user_role,
    user_phone: row.user_phone,
    user_is_active: row.user_is_active,
  };
};
module.exports = { mapUser };
