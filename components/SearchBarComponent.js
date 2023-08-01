import React, { memo } from "react";
import { Searchbar } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";

const SearchBarComponent = ({ searchQuery, setSearchQuery }) => {
  const onChangeSearch = (query) => setSearchQuery(query);

  return (
    <Searchbar
      placeholder="Search"
      onChangeText={onChangeSearch}
      value={searchQuery}
      icon={() => <FontAwesome name="search" size={24} color="black" />}
    />
  );
};

export default memo(SearchBarComponent);
