using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")] // root to use [] - placeholder replaced ny the name of controller - values
    [ApiController] // validation, diong some magic behind the scene
    public class ActivitiesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ActivitiesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<Activity>>> List() {
            return await _mediator.Send(new List.Query()); // new class of type List.Query extends IRequest<List<Activity>>
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> Details(Guid id) {
            return await _mediator.Send(new Details.Query{Id = id}); // new class of type Details.Query extends IRequest<Activity>
        }

        [HttpPost]
        public async Task<ActionResult<Unit>> Create(Create.Command command) { // [FromBody] if not using [ApiContriller]
            return await _mediator.Send(command); 
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Unit>> Edit(Guid id, Edit.Command command) { 
            command.Id = id;
            return await _mediator.Send(command); 
        }

        [HttpDelete("{id}")]
         public async Task<ActionResult<Unit>> Delete(Guid id) {             
            return await _mediator.Send(new Delete.Command{Id = id}); 
        }
    }
}