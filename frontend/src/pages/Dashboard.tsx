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
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const isAdmin = user?.role === 'admin';
        
        // Always fetch team, blog, and portfolio stats
        const [teamRes, blogRes, portfolioRes] = await Promise.all([
          axios.get('http://localhost:5000/api/v1/team', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/v1/blogs', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/v1/portfolio', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        let usersCount = 0;
        
        // Only fetch users stats if user is admin
        if (isAdmin) {
          try {
            const usersRes = await axios.get('http://localhost:5000/api/users', {
              headers: { Authorization: `Bearer ${token}` },
            });
            usersCount = usersRes.data.length;
          } catch (error) {
            console.error('Error fetching users stats:', error);
            usersCount = 0;
          }
        }

        setStats({
          team: teamRes.data.length,
          blog: blogRes.data.length,
          portfolio: portfolioRes.data.length,
          users: usersCount,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [token, user]);

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
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Team Members"
            value={stats.team}
            icon={<PeopleIcon color="primary" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Blog Posts"
            value={stats.blog}
            icon={<ArticleIcon color="primary" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Portfolio Items"
            value={stats.portfolio}
            icon={<WorkIcon color="primary" />}
          />
        </Grid>
        {user?.role === 'admin' && (
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Users"
              value={stats.users}
              icon={<PersonIcon color="primary" />}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard; 