import React from "react";

function RoleSelect() {
  return (
    <div className="role-selection">
      <h2>Choose Your Roles</h2>
      <div className="roles">
        <button className="role-btn">Doctors</button>
        <button className="role-btn">Pharmacy</button>
        <button className="role-btn">Patient</button>
      </div>
    </div>
  );
}

export default RoleSelect;
