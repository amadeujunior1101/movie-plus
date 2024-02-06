import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DetailsScreen } from './screens/Details.screen';
import { HomeScreen } from './screens/Home.screen';
import { ResultScreen } from './screens/Result.screen';

const RouteComponent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <HomeScreen />
            </Layout>
          }
        />
        <Route
          path="/results"
          element={
            <Layout>
              <ResultScreen />
            </Layout>
          }
        />
        <Route
          path="/details"
          element={
            <Layout>
              <DetailsScreen />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default RouteComponent;