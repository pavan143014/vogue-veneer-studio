import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface ShippingFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface ShippingFormProps {
  formData: ShippingFormData;
  onChange: (data: ShippingFormData) => void;
  errors: Partial<Record<keyof ShippingFormData, string>>;
}

const ShippingForm = ({ formData, onChange, errors }: ShippingFormProps) => {
  const handleChange = (field: keyof ShippingFormData, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-semibold text-foreground">
        Shipping Details
      </h2>

      <div className="grid gap-4">
        <div>
          <Label htmlFor="fullName" className="font-body text-sm">
            Full Name *
          </Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="Enter your full name"
            className={errors.fullName ? "border-destructive" : ""}
          />
          {errors.fullName && (
            <p className="font-body text-xs text-destructive mt-1">{errors.fullName}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email" className="font-body text-sm">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="your@email.com"
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="font-body text-xs text-destructive mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone" className="font-body text-sm">
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && (
              <p className="font-body text-xs text-destructive mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="address" className="font-body text-sm">
            Street Address *
          </Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="House/Flat No., Building, Street, Landmark"
            rows={3}
            className={errors.address ? "border-destructive" : ""}
          />
          {errors.address && (
            <p className="font-body text-xs text-destructive mt-1">{errors.address}</p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city" className="font-body text-sm">
              City *
            </Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="City"
              className={errors.city ? "border-destructive" : ""}
            />
            {errors.city && (
              <p className="font-body text-xs text-destructive mt-1">{errors.city}</p>
            )}
          </div>

          <div>
            <Label htmlFor="state" className="font-body text-sm">
              State *
            </Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => handleChange("state", e.target.value)}
              placeholder="State"
              className={errors.state ? "border-destructive" : ""}
            />
            {errors.state && (
              <p className="font-body text-xs text-destructive mt-1">{errors.state}</p>
            )}
          </div>

          <div>
            <Label htmlFor="pincode" className="font-body text-sm">
              PIN Code *
            </Label>
            <Input
              id="pincode"
              value={formData.pincode}
              onChange={(e) => handleChange("pincode", e.target.value)}
              placeholder="XXXXXX"
              className={errors.pincode ? "border-destructive" : ""}
            />
            {errors.pincode && (
              <p className="font-body text-xs text-destructive mt-1">{errors.pincode}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingForm;
