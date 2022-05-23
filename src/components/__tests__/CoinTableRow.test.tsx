import { coinsDummyData } from '../../../coinsDummyData';
import renderer from 'react-test-renderer';
import { CoinTableRow } from '../CoinTable';

it('renders correctly', () => {
  const tree = renderer
    .create(<CoinTableRow coinDetailed={coinsDummyData[0]} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
