import { useState, useEffect } from "react";
import { getModelFieldNames } from "../api/ankiConnect";
import type { FieldMapping } from "../types";
import { useI18n } from "../i18n";

interface FieldMappingPanelProps {
  noteType: string;
  mapping: FieldMapping | null;
  onMappingChange: (noteType: string, mapping: FieldMapping) => void;
}

export function FieldMappingPanel({
  noteType,
  mapping,
  onMappingChange,
}: FieldMappingPanelProps) {
  const { t } = useI18n();
  const [fields, setFields] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const ROLES = [
    { key: "word" as const, label: t("mainWord"), required: true },
    { key: "meaning" as const, label: t("meaning"), required: false },
    { key: "furigana" as const, label: t("furigana"), required: false },
  ];

  useEffect(() => {
    if (!noteType) {
      setFields([]);
      return;
    }
    setLoading(true);
    getModelFieldNames(noteType)
      .then(setFields)
      .catch(() => setFields([]))
      .finally(() => setLoading(false));
  }, [noteType]);

  if (!noteType || fields.length === 0) return null;
  if (loading) return <div className="field-mapping">{t("loadingFields")}</div>;

  const current: FieldMapping = mapping || { word: "", meaning: "", furigana: "" };

  function handleChange(role: keyof FieldMapping, value: string) {
    const updated = { ...current, [role]: value };
    onMappingChange(noteType, updated);
  }

  return (
    <div className="field-mapping">
      <h3>{t("fieldMapping")}</h3>
      <p className="helper-text">{t("fieldMappingDesc")}</p>
      {ROLES.map((role) => (
        <label key={role.key}>
          {role.label}
          {role.required && " *"}
          <select
            value={current[role.key]}
            onChange={(e) => handleChange(role.key, e.target.value)}
          >
            <option value="">{role.required ? t("selectField") : t("none")}</option>
            {fields.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </label>
      ))}
    </div>
  );
}
