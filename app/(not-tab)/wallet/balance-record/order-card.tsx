type ShopCardProps = {
  record: any;
};

export default function OrderCard({ record }: ShopCardProps) {
  return (
    <div className="rounded-box mb-3 px-2 py-3">
      <div className="flex justify-between">
        <div>
          <div className="text-title !text-base">{record?.bizReference}</div>
          <div className="">{record?.bizType}</div>
          <div className="">{record?.updateTime}</div>
        </div>
        <div>
          <p className="text-price-lg">{record.amount}</p>
          <p>{record.status}</p>
        </div>
      </div>
    </div>
  );
}
