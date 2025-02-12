import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import RichtextEditor from "../../Components/Richtext/RichtextEditor";
import { useBlogUnit } from "../../Context/BlogUnitContext";
import { Block } from "../../utils/types";

interface ParagraphProps {
  block: Block;
  setBlock: Dispatch<SetStateAction<Block>>;
}

const Paragraph: React.FC<ParagraphProps> = ({ block, setBlock }) => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const { elementTopPosition, setElementTopPosition, setIsShowBlocksPreview } =
    useBlogUnit();
  const onContentChange = (
    controlValue: string,
    attributeObjectKey: string
  ) => {
    console.log("controlValue", controlValue);
    if (controlValue === "/") {
      console.log("In show block preview");
      // Measure position when the component mounts
      getElementPosition();
      setIsShowBlocksPreview(true);
    } else {
      console.log("In set block content.");
      setBlock({
        ...block,
        [attributeObjectKey]: controlValue,
      });
    }
  };

  const getElementPosition = () => {
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      const elementTop = rect.top + window.scrollY;
      setElementTopPosition(elementTop);
    }
  };

  useEffect(() => {
    // Measure position when the component mounts
    getElementPosition();

    // Optionally, measure on window resize or scroll
    const handleResizeOrScroll = () => getElementPosition();
    window.addEventListener("resize", handleResizeOrScroll);
    window.addEventListener("scroll", handleResizeOrScroll);

    return () => {
      window.removeEventListener("resize", handleResizeOrScroll);
      window.removeEventListener("scroll", handleResizeOrScroll);
    };
  }, []);

  console.log(elementTopPosition);

  return (
    <div ref={elementRef}>
      <RichtextEditor
        tagType={"p"}
        className={`${block.content.length === 0 ? "is-block-empty" : ""}`}
        id={block.block_id}
        controlValue={block.content}
        onContentChange={onContentChange}
        attributeObjectKey="content"
      />
    </div>
  );
};

export default Paragraph;

// " has-focus text-white"
