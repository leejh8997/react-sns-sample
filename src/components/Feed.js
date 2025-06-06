import React, { useState, useEffect } from 'react';
import {
  Grid2, AppBar, Toolbar, Typography, Container, Box, Card,
  CardMedia, CardContent, Dialog, DialogTitle, DialogContent,
  IconButton, DialogActions, Button, TextField, List, ListItem,
  ListItemText, ListItemAvatar, Avatar, ImageList, ImageListItem,
  ImageListItemBar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StarBorderIcon from '@mui/icons-material/StarBorder';

// const mockFeeds = [
//   {
//     id: 1,
//     title: '게시물 1',
//     description: '이것은 게시물 1의 설명입니다.',
//     image: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
//   },
//   {
//     id: 2,
//     title: '게시물 2',
//     description: '이것은 게시물 2의 설명입니다.',
//     image: 'https://images.unsplash.com/photo-1521747116042-5a810fda9664',
//   },
//   // 추가 피드 데이터
// ];

function Feed() {
  const [feeds, setFeeds] = useState([]); // 전체 피드
  const [open, setOpen] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const handleClickOpen = (feed) => {
    fetch('http://localhost:3005/feed/' + feed.id)
      .then(res => res.json())
      .then(data => {
        if (data.message === 'success') {
          setSelectedFeed(data.feed); // 제목/내용
          setSelectedImages(data.images); // 이미지 배열
          setOpen(true);
          setComments([
            { id: 'user1', text: '멋진 사진이에요!' },
            { id: 'user2', text: '이 장소에 가보고 싶네요!' },
            { id: 'user3', text: '아름다운 풍경이네요!' },
          ]);
          setNewComment('');
        }
      });
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFeed(null);
    setComments([]); // 모달 닫을 때 댓글 초기화
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, { id: 'currentUser', text: newComment }]); // 댓글 작성자 아이디 추가
      setNewComment('');
    }
  };

  useEffect(() => {
    fetch('http://localhost:3005/feed')
      .then(res => res.json())
      .then(data => {
        if (data.message === "success") {
          setFeeds(data.list);
        }
      });
  }, []);

  return (
    <Container maxWidth="md">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">SNS</Typography>
        </Toolbar>
      </AppBar>

      <Box mt={4}>
        <Grid2 container spacing={3}>
          {feeds.map(feed => (
            <Grid2 xs={12} sm={6} md={4} key={feed.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={feed.imgPath || '/no-image.png'} // 썸네일
                  alt={feed.title}
                  onClick={() => handleClickOpen(feed)}
                  style={{ cursor: 'pointer' }}
                />
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    {feed.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Box>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle>
          {selectedFeed?.title}
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1">{selectedFeed?.content}</Typography>
            <Box mt={2}>
              <ImageList
                sx={{
                  width: '100%',
                  transform: 'translateZ(0)',
                }}
                rowHeight={200}
                gap={8}
              >
                {selectedImages.map((item, index) => (
                  <ImageListItem key={index} cols={1} rows={1}>
                    <img
                      src={`${item.imgPath}?w=250&h=200&fit=crop&auto=format`}
                      srcSet={`${item.imgPath}?w=250&h=200&fit=crop&auto=format&dpr=2 2x`}
                      alt={`피드 이미지 ${index + 1}`}
                      loading="lazy"
                    />
                    <ImageListItemBar
                      title={`이미지 ${index + 1}`}
                      position="top"
                      sx={{
                        background:
                          'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                          'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                      }}
                      actionIcon={
                        <IconButton
                          sx={{ color: 'white' }}
                          aria-label={`star 이미지 ${index + 1}`}
                        >
                          <StarBorderIcon />
                        </IconButton>
                      }
                      actionPosition="left"
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>
          </Box>

          <Box sx={{ width: '300px', marginLeft: '20px' }}>
            <Typography variant="h6">댓글</Typography>
            <List>
              {comments.map((comment, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar>{comment.id.charAt(0).toUpperCase()}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={comment.text} secondary={comment.id} />
                </ListItem>
              ))}
            </List>
            <TextField
              label="댓글을 입력하세요"
              variant="outlined"
              fullWidth
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddComment}
              sx={{ marginTop: 1 }}
            >
              댓글 추가
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">닫기</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Feed;