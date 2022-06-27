import { FC } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import 'react-popper-tooltip/dist/styles.css';
import { Eye } from 'tabler-icons-react';
// import Icon from '../Icon';

type PostViewsProps = {
  views: number;
};

const PostViews: FC<PostViewsProps> = ({ views }) => {
  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip();

  return (
    <>
      <div className="flex gap-1 items-center" ref={setTriggerRef}>
        <Eye size={16} />
        <span className="text-xs text-blueGray-600">{views}</span>
      </div>
      {visible && (
        <div ref={setTooltipRef} {...getTooltipProps({ className: 'tooltip-container' })}>
          <div {...getArrowProps({ className: 'tooltip-arrow' })} />
          <span className="text-xs">조회수</span>
        </div>
      )}
    </>
  );
};

export default PostViews;
