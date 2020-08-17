import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle,
  Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader,
  ModalBody, Label, Row, Col} from 'reactstrap';
import { Link } from "react-router-dom";
import { Control, LocalForm, Errors } from "react-redux-form";
import { Loading } from './LoadingComponent'
import { baseUrl } from "../shared/baseUrl"
import { FadeTransform, Fade, Stagger } from 'react-animation-components'


const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <=len);
const minLength = (len) => (val) => (val) && (val.length >=len);

class CommentForm extends Component{
  constructor(props){
    super(props);
    this.state={
      isModalOpen: false
    }
    this.toggleModal = this.toggleModal.bind(this);
  }


  toggleModal(){
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  }

  handleSubmit(values){
    this.toggleModal();
    this.props.postComment(this.props.dishId, values.rating, values.name, values.comment)
  }

  render(){
    return(
      <div>
      <Button outline onClick={this.toggleModal}>
        <span className="fa fa-sign-in fa-lg"></span> Submit Comment
      </Button>
      <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
        <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
        <ModalBody>
          <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
          <Row className="form-group">
            <Col>
                <Label htmlFor="rating">Rating</Label>
                  <Control.select model=".rating" name="rating"
                      className="form-control">
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                  </Control.select>
                  </Col>
          </Row>
          <Row className="form-group">
            <Col>
                <Label htmlFor="name">Your Name</Label>
                <Control.text model=".name" id="name" name="name"
                    placeholder="Your Name"
                    className="form-control"
                    validators={{
                      required, minLength: minLength(3), maxLength: maxLength(15)
                    }}
                    />
                    <Errors
                      className="text-danger"
                      model=".name"
                      show="touched"
                      messages={{
                          required: "Required",
                          minLength: "Must be greater than 2 numbers",
                          maxLength: "Must be less than 15 numbers"
                        }}
                    />
              </Col>
          </Row>
          <Row className="form-group">
            <Col>
              <Label htmlFor="message">Comment</Label>
                  <Control.textarea model=".comment" id="comment" name="comment"
                      rows="6"
                      className="form-control" />
            </Col>
          </Row>
          <Row className="form-group">
              <Col>
                  <Button type="submit" color="primary">
                  Submit
                  </Button>
              </Col>
          </Row>
          </LocalForm>
        </ModalBody>
      </Modal>
      </div>
    );
  }
}


function RenderDish({dish}){
    if(dish!=null){
      return(
        <FadeTransform in
          transformProps={{
            exitTransform: 'scale(0.5) translateY(-50%)'
          }}>
        <Card>
          <CardImg width="100%" object src={baseUrl + dish.image} alt={dish.name}/>
          <CardBody>
            <CardTitle>{dish.name}</CardTitle>
            <CardText>{dish.description}</CardText>
          </CardBody>
        </Card>
        </FadeTransform>
      );
    }else{
      return (
        <div></div>
      );
    }
  }


function RenderComments({comments, postComment, dishId}){
    try {
      return comments.map(comment =>(
        <Fade in>
          <ul key={comment.id} className="list-unstyled">
            <li>{comment.comment}</li>
            <li>-- {comment.author}, {new Intl.DateTimeFormat("en-US", {year: "numeric", month: "short", day:"2-digit"}).format(new Date(Date.parse(comment.date)))}</li>
          </ul>
        </Fade>
      ))
    } catch (e) {
      return(
        <div></div>
      )
    }
  }

  const DishDetail = (props) => {
    const dish = props.dish;
    let comments;
    if(props.isLoading){
      return (
        <div className="container">
          <div className="row">
            <Loading />
          </div>
        </div>
      );
    }
    else if(props.errMess){
      return (
        <div className="container">
          <div className="row">
            <h4> {props.errMess} </h4>
          </div>
        </div>
      );
    } else{
    try {
      comments = props.comments;
    } catch{
    }
    return(
      <div className="container">
      <div className="row">
          <Breadcrumb>
              <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
              <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
          </Breadcrumb>
          <div className="col-12">
              <h3>{props.dish.name}</h3>
              <hr />
          </div>
      </div>
        <div className="row">
          <div className="col-12 col-md-5 m-1">
            <RenderDish dish={dish}/>
          </div>
          <div className="col-12 col-md-5 m-1">
            <h4>Comments</h4>
            <div>
              <Stagger in>
              <RenderComments comments={comments}
              postComment={props.postComment}
              dishId= {props.dish.id}
              />
              </Stagger>
              <CommentForm dishId={dish.id} postComment={props.postComment} />
            </div>
          </div>
        </div>
      </div>
    );
  }
  }

export default DishDetail;
