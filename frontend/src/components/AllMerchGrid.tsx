import React from "react";

// This is a panel containing a grid of merch items that a group has created
// This will be used in the Merchandise tab
// Since the gid is available in the context, we can use it to fetch the merch items
// Also, we accept a click handler that will be called when the user clicks on a merch item
// It will call a function and pass the merch item id to it (or maybe the merch item itself, we'll see)

interface AllMerchGridProps {
  handleClick: (id: string) => void;
}

const AllMerchGrid = ({ handleClick }: AllMerchGridProps) => {
  // implementation

  return (
    <>
      <div></div>
    </>
  );
};
export default AllMerchGrid;
