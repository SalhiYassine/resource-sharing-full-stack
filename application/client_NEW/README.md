# How to add additional components?
Simply import your component into the 'Content.js' within the content folder. Create a new route with said component inside. Upon doing so add said route to the sidebar in the form of a 'NavLink' look through the file if you seek examples or message me to get any clarification.


# New route example:
(components/content/Content.js)

``` 
    <Route path="/resources/:resource" component={DetailsPage} />
```

# New NavLink example :
(components/sidebar/Sidebar.js)
``` 
    <NavItem>
          <NavLink className="d-flex nav-links" tag={Link} to={////Your route////}>
            <fa.FaHome className="nav-icons"/>
            <h4 className="nav-links">Name of your page</h4>
          </NavLink>
        </NavItem>
```


# reactstrap-basic-sidebar
Static collapsible Bootstrap sidebar menu

# Installation
```
npm install
```
# run
```
npm start
```
# Preview
<a><img src="/preview.gif"></img></a>

# Original HTML/Bootstrap template

<a href="https://bootstrapious.com/p/bootstrap-sidebar">bootstrapious.com</a>
