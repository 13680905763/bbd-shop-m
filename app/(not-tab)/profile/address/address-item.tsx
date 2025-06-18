import { Checkbox, Divider } from "@heroui/react";
import { FaTrashAlt, FaEdit } from "react-icons/fa";

type AddressItemProps = {
  addressDetail: any;
  handleDelete: any;
  handleEdit: any;
};

export default function AddressItem({
  addressDetail,
  handleDelete,
  handleEdit,
}: AddressItemProps) {
  console.log("address", addressDetail);

  return (
    <div className="rounded-box my-3 mb-3 flex flex-col gap-2 p-4">
      <div className="flex gap-4">
        <span className="">{addressDetail.recipient}</span>
        <span className="">{addressDetail.phone}</span>
      </div>
      <div className="line-clamp-2">{addressDetail.address}</div>
      <Divider className="my-2" />
      <div className="flex justify-between">
        <Checkbox
          className="m-0 p-0"
          classNames={{
            wrapper: "p-0 m-0",
          }}
          defaultSelected={addressDetail.defaultAddress}
        >
          设为默认收货地址
        </Checkbox>
        <div className="flex gap-2">
          <button
            className="h-6 w-6"
            onClick={() => handleDelete(addressDetail)}
          >
            <FaTrashAlt className="h-4 w-4" />
          </button>
          <button className="h-6 w-6" onClick={() => handleEdit(addressDetail)}>
            <FaEdit className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
