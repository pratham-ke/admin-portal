import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import {
  People as PeopleIcon,
  Article as ArticleIcon,
  Work as WorkIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Stats {
  team: number;
  blog: number;
  portfolio: number;
  users: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    team: 0,
    blog: 0,
    portfolio: 0,
    users: 0,
  });
  const { token } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [teamRes, blogRes, portfolioRes, usersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/team', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/blog', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/portfolio', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/users', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setStats({
          team: teamRes.data.length,
          blog: blogRes.data.length,
          portfolio: portfolioRes.data.length,
          users: usersRes.data.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [token]);

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
  }> = ({ title, value, icon }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" component="div" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid component="div">
          <StatCard
            title="Team Members"
            value={stats.team}
            icon={<PeopleIcon color="primary" />}
          />
        </Grid>
        <Grid component="div">
          <StatCard
            title="Blog Posts"
            value={stats.blog}
            icon={<ArticleIcon color="primary" />}
          />
        </Grid>
        <Grid component="div">
          <StatCard
            title="Portfolio Items"
            value={stats.portfolio}
            icon={<WorkIcon color="primary" />}
          />
        </Grid>
        <Grid component="div">
          <StatCard
            title="Users"
            value={stats.users}
            icon={<PersonIcon color="primary" />}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 