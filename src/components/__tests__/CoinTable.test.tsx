import renderer from 'react-test-renderer';
import { CoinTable } from '../CoinTable';
import { coinsDummyData } from '../../../coinsDummyData';

it('renders correctly', () => {
  const tree = renderer
    .create(<CoinTable coinsDetailed={coinsDummyData} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
