import ShallowRenderer from 'react-test-renderer/shallow';

// in your test:
const renderer = new ShallowRenderer();
renderer.render(<Homepage />);
const result = renderer.getRenderOutput();

expect(result.type).toBe('div');
// expect(result.props.children).toEqual([
//   <span className="heading">Title</span>,
//   <Subcomponent foo="bar" />
// ]);