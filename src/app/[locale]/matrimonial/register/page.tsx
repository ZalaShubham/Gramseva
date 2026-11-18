"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { CreatedBy, Gender, Profile, PhotoPrivacy } from "@/modules/matrimonial/types";

/**
 * Registration / Biodata form for a Matrimonial profile.
 * Supports creation by self, parent, or sibling (stored in `createdBy`).
 */
export default function MatrimonialRegistration() {
  const t = useTranslations("matrimonial");
  const router = useRouter();

  const [form, setForm] = useState({
    createdBy: CreatedBy.Self as CreatedBy,
    name: "",
    gender: Gender.Female as Gender,
    dateOfBirth: "",
    heightCm: "",
    education: "",
    occupation: "",
    incomeRange: "",
    nativePlace: "",
    subCaste: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = // client‑side age validation before sending\n    const calculateAge = (dob: string) => {\n      const birth = new Date(dob);\n      const now = new Date();\n      let age = now.getFullYear() - birth.getFullYear();\n      const m = now.getMonth() - birth.getMonth();\n      if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;\n      return age;\n    };\n    const age = calculateAge(form.dateOfBirth);\n    if (form.gender === Gender.Male && age < 21) {\n      alert(t("registrationError") + ": " + t("maleAgeError"));\n      return;\n    }\n    if (form.gender === Gender.Female && age < 18) {\n      alert(t("registrationError") + ": " + t("femaleAgeError"));\n      return;\n    }\n    const res = await fetch("/api/matrimonial/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      router.push(`/matrimonial/${data.id}`);
    } catch (err: any) {
      alert(t("registrationError") + ": " + err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t("registrationTitle")}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Created by */}
        <label>
          {t("createdByLabel")}
          <select name="createdBy" value={form.createdBy} onChange={handleChange} className="w-full mt-1">
            <option value={CreatedBy.Self}>{t("createdBySelf")}</option>
            <option value={CreatedBy.Parent}>{t("createdByParent")}</option>
            <option value={CreatedBy.Sibling}>{t("createdBySibling")}</option>
          </select>
        </label>
        {/* Name */}
        <label>
          {t("nameLabel")}
          <input name="name" value={form.name} onChange={handleChange} required className="w-full mt-1" />
        </label>
        {/* Gender */}
        <label>
          {t("genderLabel")}
          <select name="gender" value={form.gender} onChange={handleChange} className="w-full mt-1">
            <option value={Gender.Male}>{t("genderMale")}</option>
            <option value={Gender.Female}>{t("genderFemale")}</option>
            <option value={Gender.Other}>{t("genderOther")}</option>
          </select>
        </label>
        {/* Date of Birth */}
        <label>
          {t("dobLabel")}
          <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} required className="w-full mt-1" />
        </label>
        {/* Height */}
        <label>
          {t("heightLabel")}
          <input type="number" name="heightCm" value={form.heightCm} onChange={handleChange} className="w-full mt-1" placeholder={t("heightPlaceholder")} />
        </label>
        {/* Education */}
        <label>
          {t("educationLabel")}
          <input name="education" value={form.education} onChange={handleChange} className="w-full mt-1" />
        </label>
        {/* Occupation */}
        <label>
          {t("occupationLabel")}
          <input name="occupation" value={form.occupation} onChange={handleChange} className="w-full mt-1" />
        </label>
        {/* Income Range */}
        <label>
          {t("incomeRangeLabel")}
          <input name="incomeRange" value={form.incomeRange} onChange={handleChange} className="w-full mt-1" />
        </label>
        {/* Native Place */}
        <label>
          {t("nativePlaceLabel")}
          <input name="nativePlace" value={form.nativePlace} onChange={handleChange} className="w-full mt-1" />
        </label>
        {/* Sub‑Caste (dropdown) */}
        <label>
          {t("subCasteLabel")}
          <select name="subCaste" value={form.subCaste} onChange={handleChange} className="w-full mt-1">
            {/* TODO: populate options from a constant list */}
            <option value="">{t("selectSubCaste")}</option>
            <option value="Brahmin">Brahmin</option>
            <option value="Kshatriya">Kshatriya</option>
            <option value="Vaishya">Vaishya</option>
            <option value="Shudra">Shudra</option>
          </select>
        </label>
        <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded">
          {t("registerButton")}
        </button>
      </form>
    </div>
  );
}
