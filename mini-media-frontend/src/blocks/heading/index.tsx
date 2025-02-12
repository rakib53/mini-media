import { Dispatch, SetStateAction } from "react";
import TextBlockEditor from "../../Components/Richtext/RichtextEditor";
import { Block } from "../../utils/types";

interface HeadingProps {
  block: Block;
  setBlock: Dispatch<SetStateAction<Block>>;
}

const Heading: React.FC<HeadingProps> = ({ block }) => {
  const onContentChange = (controlValue: string) => {
    console.log(controlValue);
  };
  return (
    <TextBlockEditor
      tagType={"h1"}
      className="is-block-empty has-focus text-white"
      id={block.block_id}
      controlValue={block.content}
      onContentChange={onContentChange}
    />
  );
};

export default Heading;
