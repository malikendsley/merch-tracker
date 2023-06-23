import React from "react";
import { Container } from "react-bootstrap";
import { authedFetch } from "../utility/AuthedFetch";
import { useGroupState } from "../contexts/GroupContext";
import "../css/AllMerchGrid.css";

// Define the MerchType interface
interface MerchType {
  gid: string; // group id (belongs to)
  mtid?: string; // MerchType ID. optional, until the merch type is created (but immediately available to the client)
  name: string; // merch type name
  description: string; // merch type description
  imageUrl: string; // merch type image url
}
// This is a panel containing a grid of merch items that a group has created
// This will be used in the Merchandise tab
// Since the gid is available in the context, we can use it to fetch the merch items
// Also, we accept a click handler that will be called when the user clicks on a merch item
// It will call a function and pass the merch item id to it (or maybe the merch item itself, we'll see)

interface AllMerchGridProps {
  handleClick: (id: string) => void;
}

const AllMerchGrid = ({ handleClick }: AllMerchGridProps) => {
  // data is an array of merch items, ready to be supplied to the grid
  const [data, setData] = React.useState([]);
  const {
    group: { gid },
  } = useGroupState();
  // fetch the merch items from the backend
  React.useEffect(() => {
    let ignore = false;
    // fetch the merch items
    console.log("Fetching merch; ignore is " + ignore);
    authedFetch(`/api/merch/types/gid/${gid}`, {
      method: "GET",
    }).then((response) => {
      if (response.ok) {
        response.json().then((json) => {
          if (!ignore) {
            setData(json);
          }
        });
      } else {
        console.log("Failed to fetch merch items");
      }
    });
    // process the merch items into a list
    // set the data to the list

    // on cleanup, ignore
    return () => {
      ignore = true;
    };
  }, [gid]);

  return (
    <Container>
      {
        // map the data to a grid of merch items
        data.map((item: MerchType) => {
          return (
            <div
              className="merch-item"
              key={item.mtid}
              onClick={() => handleClick(item.mtid ?? "")}
            >
              <img src={item.imageUrl} alt={item.name} />
              <div className="merch-item-name">{item.name}</div>
              <div className="merch-item-description">{item.description}</div>
            </div>
          );
        })
      }
    </Container>
  );
};
export default AllMerchGrid;
