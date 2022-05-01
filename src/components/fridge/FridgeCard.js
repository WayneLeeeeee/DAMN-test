import React, { useState } from "react";
import moment from "moment";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";

function FridgeCard({
  item,
  index,
  openEditDialog,
  openDeleteDialog,
  isDeleteAndUpdateButtonsHidden,
}) {
  return (
    <div className="fridgePage__item" key={index}>
      <div className="fridgePage__item__img">
        <img src={item.imageURL?.url} alt="" />
      </div>
      <div className="fridgePage__item__content">
        <h4>{item.name}</h4>
        <h5>
          數量：
          {item.quantity}
          {item.unit}
        </h5>
        <h5>{item.isFrozen}</h5>
        <h5>{moment(item.endDate.seconds * 1000).format("YYYY/MM/DD")}</h5>
        <h6>
          距離到期日：剩
          {-moment(new Date()).diff(
            moment(item.endDate.seconds * 1000).format("YYYY/MM/DD"),
            "days"
          ) + 1}
          日
        </h6>
      </div>
      {!isDeleteAndUpdateButtonsHidden && (
        <div className="fridgePage__item__edit">
          <CloseIcon onClick={() => openDeleteDialog(item?.id)} />
          <EditIcon onClick={() => openEditDialog(item)} />
        </div>
      )}
    </div>
  );
}

export default FridgeCard;
