import { useQueryClient } from "@tanstack/react-query";

import { userQueries } from "../../queries/userQueries";
import type { User } from "../../types/user.types";
import UserStatusToggle from "./UserStatusToggle";

interface UserTableProps {
  users: User[];
  updatingUserId: number | null;
  onView: (userId: number) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onStatusToggle: (user: User) => void;
}

function UserTable({
  users,
  updatingUserId,
  onView,
  onEdit,
  onDelete,
  onStatusToggle,
}: UserTableProps) {
  const queryClient = useQueryClient();

  const handlePrefetch = (userId: number) => {
    queryClient.prefetchQuery(userQueries.detail(userId));
  };

  return (
    <div className="users-table-wrapper">
      <table className="users-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Company</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <div className="user-table-name">
                  <strong>
                    {user.firstName} {user.lastName}
                  </strong>

                  <span>@{user.username}</span>
                </div>
              </td>

              <td>{user.email}</td>

              <td>{user.phone}</td>

              <td>{user.company.name}</td>

              <td>
                <span className="user-role">{user.role}</span>
              </td>

              <td>
                <UserStatusToggle
                  status={user.status}
                  isUpdating={updatingUserId === user.id}
                  onToggle={() => onStatusToggle(user)}
                />
              </td>

              <td>
                <div className="user-table-actions">
                  <button
                    type="button"
                    className="user-view-button"
                    onMouseEnter={() => handlePrefetch(user.id)}
                    onFocus={() => handlePrefetch(user.id)}
                    onClick={() => onView(user.id)}
                  >
                    View
                  </button>

                  <button
                    type="button"
                    className="user-edit-button"
                    onClick={() => onEdit(user)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="user-delete-button"
                    onClick={() => onDelete(user)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
