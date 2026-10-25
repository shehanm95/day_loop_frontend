import React from "react";
import LocationList from "./locationComponents/LocationList";

export const ManageLocations: React.FC = () => {
  return (
    <div>
      <h2>Locations Management</h2>
      <LocationList></LocationList>
    </div>
  );
};