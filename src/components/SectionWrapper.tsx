import React from 'react';
import { SectionId } from '../types';

interface SectionWrapperProps {
  id: SectionId;
  title?: string;
  hindiTitle?: string;
  icon?: string;
  editMode?: boolean;
  onRemove?: (id: SectionId) => void;
  onOpenSectionManager?: () => void;
  children: React.ReactNode;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  id,
  children
}) => {
  return (
    <section id={id} className="relative scroll-mt-20">
      {children}
    </section>
  );
};
