"use client";

import { Edit2, ExternalLink, Download, Trash2 } from "lucide-react";
import { Presentation } from "@/types";

interface PresentationHistoryProps {
  presentations: Presentation[];
  onEdit: (presentation: Presentation) => void;
  onView: (presentation: Presentation) => void;
  onDownload: (presentation: Presentation) => void;
  onDelete: (id: string) => void;
}

export function PresentationHistory({ 
  presentations, 
  onEdit, 
  onView, 
  onDownload, 
  onDelete 
}: PresentationHistoryProps) {
  if (presentations.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Previous Presentations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {presentations.map((presentation) => (
          <div key={presentation.id} className="border border-border rounded-lg p-4 bg-card">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-foreground">{presentation.title}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(presentation)}
                  className="p-1 text-muted-foreground hover:text-primary"
                  title="Edit Presentation"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => onView(presentation)}
                  className="p-1 text-muted-foreground hover:text-primary"
                  title="View Presentation"
                >
                  <ExternalLink size={18} />
                </button>
                <button
                  onClick={() => onDownload(presentation)}
                  className="p-1 text-muted-foreground hover:text-primary"
                  title="Download HTML"
                >
                  <Download size={18} />
                </button>
                <button
                  onClick={() => onDelete(presentation.id)}
                  className="p-1 text-muted-foreground hover:text-accent"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground mb-2">
              Theme: <span className="capitalize">{presentation.theme}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Created: {new Date(presentation.timestamp).toLocaleDateString()}
            </div>
            <div className="mt-2 text-sm text-foreground line-clamp-2">
              {presentation.content.split('\n')[0]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
