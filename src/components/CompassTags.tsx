
import React from 'react';
import { X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

export type CompassTag = 'cognitive' | 'orchestrated' | 'memorable' | 'perceived' | 'activate' | 'social' | 'situational';

interface CompassTagsProps {
  selectedTags: CompassTag[];
  onTagSelect: (tag: CompassTag) => void;
  onTagRemove: (tag: CompassTag) => void;
}

const tagConfig = {
  cognitive: { label: 'Cognitive Ease', color: 'bg-red-100 text-red-800 hover:bg-red-200' },
  orchestrated: { label: 'Orchestrated Journeys', color: 'bg-orange-100 text-orange-800 hover:bg-orange-200' },
  memorable: { label: 'Memorable Moments', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
  perceived: { label: 'Perceived value', color: 'bg-green-100 text-green-800 hover:bg-green-200' },
  activate: { label: 'Activate Adoption', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
  social: { label: 'Social Influence', color: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200' },
  situational: { label: 'Situational Context', color: 'bg-violet-100 text-violet-800 hover:bg-violet-200' },
};

export const CompassTags: React.FC<CompassTagsProps> = ({ selectedTags, onTagSelect, onTagRemove }) => {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <Badge
            key={tag}
            className={`${tagConfig[tag].color} cursor-pointer flex items-center gap-1`}
            onClick={() => onTagRemove(tag)}
          >
            {tagConfig[tag].label}
            <X className="h-3 w-3" />
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.entries(tagConfig).map(([key, value]) => {
          const tag = key as CompassTag;
          if (!selectedTags.includes(tag)) {
            return (
              <Badge
                key={key}
                className={`${value.color} cursor-pointer opacity-60 hover:opacity-100`}
                onClick={() => onTagSelect(tag)}
              >
                {value.label}
              </Badge>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};
