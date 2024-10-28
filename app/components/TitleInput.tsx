"use client";

interface TitleInputProps {
  title: string;
  setTitle: (title: string) => void;
}

export function TitleInput({ title, setTitle }: TitleInputProps) {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Presentation Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
      />
    </div>
  );
}
