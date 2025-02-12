export type Block = {
  block_id: string; // Unique identifier for each block
  type: string; // Type of block, e.g., 'paragraph', 'image', 'heading'
  content: string; // Content of the block
  className: string; // Classes of the block
  style?: Record<string, string>; // Optional: Style attributes
  attributes?: []; // attributes of the blocks
};
