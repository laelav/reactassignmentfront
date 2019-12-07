import React from "react";
import { Button } from "semantic-ui-react";

const BetweenButton = ({ keyValue }) => {
  console.log(keyValue);
  return <Button key={keyValue} content="..." style={{ cursor: "default" }} />;
};

const Paginator = ({ currentPage, onPageChange, range = 2, pageCount }) => {
  const renderedPages = [...Array(range * 1 + 3).keys()]
    .map(i => currentPage - range + i)
    .filter(i => i > 0 && i <= pageCount);
  const showStart = currentPage - range > 1;
  const showEnd = currentPage + range < pageCount;
  return (
    <Button.Group compact>
      <Button
        key="prev"
        disabled={currentPage === 1 ? true : false}
        content="<"
        onClick={() => onPageChange(currentPage - 1)}
      />
      {showStart && [
        <Button key={1} content={1} onClick={() => onPageChange(1)} />,
        <BetweenButton key="start" keyValue="start" />
      ]}
      {renderedPages.map(page => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          content={page}
          primary={currentPage === page}
          // style={{
          //   color: "rgba(0,0,0,0.65)",
          //   marginRight: "5px",
          //   border: "1px solid #1890ff",
          //   borderRadius: "4px",
          //   background: "#fff"
          // }}
        />
      ))}
      {showEnd && [
        <BetweenButton key="end" keyValue="end" />,
        <Button
          key={pageCount}
          content={pageCount}
          onClick={() => onPageChange(pageCount)}
        />
      ]}
      <Button
        key="next"
        content=">"
        disabled={currentPage === pageCount ? true : false}
        onClick={() => onPageChange(currentPage + 1)}
      />
    </Button.Group>
  );
};

export default Paginator;
