import React, { useState } from 'react';
import { TagsInput } from 'react-tag-input-component';
import LabelUi from './LabelUi';
import { useFormContext } from 'react-hook-form';

const TagsSelectUI = ({ defaultTags }: { defaultTags?: string[] }) => {
  // const { setValue } = useFormContext();
  const [selectedTags, setSelectedTags] = useState<string[]>(defaultTags || []);

  // console.log(
  //   "🚀 ~ file: TagsSelectUI.tsx:9 ~ TagsSelectUI ~ selectedTags:",
  //   selectedTags
  // );

  //   const [selected, setSelected] = useState(["papaya"]);

  const onchangeTags = (value: string[]) => {
    // setValue("tags", value)
    setSelectedTags(value);
  };

  return (
    <div>
      <LabelUi>Select Tags</LabelUi>
      {/* <pre>{JSON.stringify(selected)}</pre> */}
      <TagsInput
        value={selectedTags}
        onChange={(value) => onchangeTags(value)}
        name="fruits"
        placeHolder="enter fruits"
      />
      <em>press enter or comma to add new tag</em>
    </div>
  );
};

export default TagsSelectUI;
