import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type {
  CreateTenantInput,
  Tenant,
  UpdateTenantInput,
} from "../../types/tenant.types";

interface TenantFormProps {
  tenant?: Tenant | null;
  isSubmitting: boolean;
  onSubmit: (data: CreateTenantInput | UpdateTenantInput) => void;
  onCancel: () => void;
}

function TenantForm({
  tenant,
  isSubmitting,
  onSubmit,
  onCancel,
}: TenantFormProps) {
  const isEditMode = Boolean(tenant);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    email: "",
    phone: "",
    plan: "Basic",
  });

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name,
        slug: tenant.slug,
        email: tenant.email,
        phone: tenant.phone,
        plan: tenant.plan,
      });
    } else {
      setFormData({
        name: "",
        slug: "",
        email: "",
        phone: "",
        plan: "Basic",
      });
    }
  }, [tenant]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanedData = {
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      plan: formData.plan,
    };

    if (isEditMode && tenant) {
      onSubmit({
        id: tenant.id,
        ...cleanedData,
      });

      return;
    }

    onSubmit(cleanedData);
  };

  return (
    <form className="tenant-form" onSubmit={handleSubmit}>
      <div className="tenant-form-header">
        <div>
          <span className="tenant-form-eyebrow">
            {isEditMode ? "Tenant Management" : "New Tenant"}
          </span>

          <h2>{isEditMode ? "Edit Tenant" : "Create Tenant"}</h2>

          <p>
            {isEditMode
              ? "Update the tenant information below."
              : "Add a new tenant to your platform."}
          </p>
        </div>
      </div>

      <div className="tenant-form-grid">
        <div className="tenant-form-group">
          <label htmlFor="tenant-name">Tenant Name</label>

          <input
            id="tenant-name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter tenant name"
            required
          />
        </div>

        <div className="tenant-form-group">
          <label htmlFor="tenant-slug">Slug</label>

          <input
            id="tenant-slug"
            name="slug"
            type="text"
            value={formData.slug}
            onChange={handleChange}
            placeholder="Enter tenant slug"
            required
          />
        </div>

        <div className="tenant-form-group">
          <label htmlFor="tenant-email">Email</label>

          <input
            id="tenant-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter tenant email"
            required
          />
        </div>

        <div className="tenant-form-group">
          <label htmlFor="tenant-phone">Phone</label>

          <input
            id="tenant-phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            required
          />
        </div>

        <div className="tenant-form-group">
          <label htmlFor="tenant-plan">Plan</label>

          <select
            id="tenant-plan"
            name="plan"
            value={formData.plan}
            onChange={handleChange}
            required
          >
            <option value="Basic">Basic</option>
            <option value="Pro">Pro</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      <div className="tenant-form-actions">
        <button
          type="button"
          className="tenant-form-cancel"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="tenant-form-submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : isEditMode
              ? "Update Tenant"
              : "Create Tenant"}
        </button>
      </div>
    </form>
  );
}

export default TenantForm;
