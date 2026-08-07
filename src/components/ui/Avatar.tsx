import Image from "next/image";

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: number;
}

function getInitials(name?: string | null) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

/**
 * Circular avatar image, falling back to initials-on-a-color-circle
 * when there's no image yet — every user has this the moment they sign
 * up, before they've ever uploaded a photo.
 */
export function Avatar({ src, name, size = 64 }: AvatarProps) {
  const style = { width: size, height: size };

  if (src) {
    return (
      <Image
        src={src}
        alt={name ?? "User avatar"}
        width={size}
        height={size}
        className="rounded-full object-cover"
      />
    );
  }

  return (
    <div
      style={style}
      className="flex items-center justify-center rounded-full bg-brand-blue/15 font-medium text-brand-blue"
    >
      {getInitials(name)}
    </div>
  );
}
