import { Collapse } from 'antd';
import parse from 'html-react-parser';
import { IFaq } from '../../schemas/faq';
const { Panel } = Collapse;
export type ItemProps = {
  key: string;
  label: string;
  children: React.ReactNode | React.ReactElement;
  isTaken?: boolean;
};
export type ItemPropsHtml = IFaq & {
  _id: string;
};

type UMCollapseProps = {
  items: ItemProps[];
  onChange?: (el: string | string[] | '') => void;
  defaultActiveKey?: string | string[];
};
type UMCollapsePropsHtml = {
  items: ItemPropsHtml[];
  onChange?: (el: string | string[] | '') => void;
  defaultActiveKey?: string | string[];
};

const UMCollapse = ({ items, onChange, defaultActiveKey = ['1'] }: UMCollapseProps) => {
  return (
    <Collapse defaultActiveKey={defaultActiveKey} onChange={onChange}>
      {items?.map((item) => {
        return (
          <Panel header={item?.label} key={item?.key}>
            {item?.children}
          </Panel>
        );
      })}
    </Collapse>
  );
};
const UMCollapseHtml = ({
  items,
  onChange,
  defaultActiveKey = ['1'],
}: UMCollapsePropsHtml) => {
  return (
    <Collapse defaultActiveKey={defaultActiveKey} onChange={onChange}>
      {items?.map((item) => {
        return (
          <Panel header={item?.question} key={item?._id}>
            {item?.answer && parse(item?.answer)}
          </Panel>
        );
      })}
    </Collapse>
  );
};

export { UMCollapseHtml };

export default UMCollapse;
