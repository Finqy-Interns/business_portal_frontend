const PermissionModal = ({ permissions, selectedPermissions, onSelectPermission, onDeselectPermission, onClose }) => {
    return (
      <div className="permission-modal">
        <h3>Select Permissions</h3>
        <ul>
          {permissions.map((permission) => (
            <li key={permission.permission_id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedPermissions.includes(permission.permission_id)}
                  onChange={() => {
                    if (selectedPermissions.includes(permission.permission_id)) {
                      onDeselectPermission(permission.permission_id);
                    } else {
                      onSelectPermission(permission.permission_id);
                    }
                  }}
                />
                {permission.name}
              </label>
            </li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };

export default PermissionModal;