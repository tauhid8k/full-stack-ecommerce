import Link from 'next/link';
import react from 'react';

const DropdownLink = react.forwardRef((props, ref) => {
  const { href, children, ...rest } = props;

  return (
    <Link href={href}>
      <a {...rest} ref={ref}>
        {children}
      </a>
    </Link>
  );
});

export default DropdownLink;
