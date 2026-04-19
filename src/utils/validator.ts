export function ensureUsefulText(text: string): { ok: boolean; message?: string } {
  const normalized = text.trim();

  if (!normalized) {
    return { ok: false, message: "Сообщение пустое. Пришлите текст пресс-релиза." };
  }

  if (normalized.length < 200) {
    return {
      ok: false,
      message: "Текста маловато. Пришлите хотя бы 2–3 абзаца — так заголовки будут точнее."
    };
  }

  if (normalized.length > 15000) {
    return {
      ok: false,
      message: "Текст слишком большой. Разделите его на части или сократите до 15 000 символов."
    };
  }

  return { ok: true };
}
