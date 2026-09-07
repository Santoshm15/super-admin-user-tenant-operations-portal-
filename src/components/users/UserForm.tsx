import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import type { CreateUserInput, UpdateUserInput } from "../../api/users.api";

import type { User } from "../../types/user.types";

interface UserFormProps {
  user?: User | null;
  isSubmitting: boolean;
  onSubmit: (data: CreateUserInput | UpdateUserInput) => void;
  onCancel: () => void;
}

function UserForm({ user, isSubmitting, onSubmit, onCancel }: UserFormProps) {
  const isEditMode = Boolean(user);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("user");

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setPhone(user.phone);
      setUsername(user.username);
      setRole(user.role);
    } else {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setUsername("");
      setRole("user");
    }
  }, [user]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const baseData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      username: username.trim(),
      role,
    };

    if (user) {
      const updateData: UpdateUserInput = {
        ...baseData,
        id: user.id,
      };

      onSubmit(updateData);
      return;
    }

    const createData: CreateUserInput = {
      ...baseData,
    };

    onSubmit(createData);
  };

  return (
    <div className="user-form-overlay">
      <div className="user-form-card">
        <div className="user-form-header">
          <div>
            <p className="section-eyebrow">User Management</p>

            <h2>{isEditMode ? "Edit User" : "Create User"}</h2>

            <p>
              {isEditMode
                ? "Update the user's account information."
                : "Add a new user to the platform."}
            </p>
          </div>

          <button
            type="button"
            className="user-form-close"
            onClick={onCancel}
            disabled={isSubmitting}
            aria-label="Close form"
          >
            ×
          </button>
        </div>

        <form className="user-form" onSubmit={handleSubmit}>
          <div className="user-form-grid">
            <div className="user-form-field">
              <label htmlFor="firstName">First Name</label>

              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="Enter first name"
                required
              />
            </div>

            <div className="user-form-field">
              <label htmlFor="lastName">Last Name</label>

              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                placeholder="Enter last name"
                required
              />
            </div>

            <div className="user-form-field">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="user-form-field">
              <label htmlFor="phone">Phone</label>

              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="user-form-field">
              <label htmlFor="username">Username</label>

              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter username"
                required
              />
            </div>

            <div className="user-form-field">
              <label htmlFor="role">Role</label>

              <select
                id="role"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                required
              >
                <option value="user">User</option>

                <option value="moderator">Moderator</option>

                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="user-form-actions">
            <button
              type="button"
              className="user-form-cancel"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="user-form-submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : isEditMode
                  ? "Update User"
                  : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserForm;
