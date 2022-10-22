class Equipment {
    constructor(name) {
        this.name = name;
        this.sports = [];
    }

    addSport(name, type) {
        this.sports.push(new Sport(name, type));
    }
}

class Sport {
    constructor(name, type) {
        this.name = name;
        this.type = type;
    }
}

class EquipmentService {
    static url = 'https://6351e1a49d64d7c7130a01ba.mockapi.io';

    static getAllEquipments() {
        return $.get(this.url);
    }

    static getEquipment(id) {
        return $.get(this.url + `/${id}`);
    }

    static creatEquipment(equipment) {
        return $.post(this.url, equipment);
    }

    static updateEquipment(equipment) {
        return $.ajax({
            url: this.url + `/${equipment._id}`,
            dataType: 'json',
            data: JSON.stringify(equipment),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteEquipment(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}

class DOMManger {
    static equipments;

    static getAllEquipments() {
        EquipmentService.getAllEquipments().then(equipments => this.render(equipments));
    }

    static creatEquipment(name) {
        EquipmentService.creatEquipment(new Equipment(name))
        .then(() => {
            return EquipmentService.getAllEquipments();
        })
        .then((equipments) => this.renger(equipments))
    }

    static deleteEquipment(id) {
        EquipmentService.deleteEquipment(id)
        .then(() => {
            return EquipmentService.getAllEquipments();
        })
        .then((equipment) => this.render(equipment));
    }

    static addSport(id) {
        for (let equipment of this.equipments) {
            if (equipment._id == id) {
                equipment.sports.push(new Sport($(`#${equipment._id}-sport-name`).val(), $(`#${equipment.id}-sport-type`).val()));
                EquipmentService.updateEquipment(equipment)
                .then(() => {
                    return EquipmentService.getAllEquipments();
                })
                .then((equipments) => this.render(equipments));
            }
        }
    }

    static deleteSport(equipmentId, sportId) {
        for (let equipment of this.equipments) {
            if(equipment._id == equipmentId) {
                for (let sport of equipment.sports) {
                    if(sport._id == sportId) {
                        equipment.sport.splice(equipment.sport.indexOf(sport), 1);
                        EquipmentService.updateEquipment(equipment)
                        .then(() => {
                            return EquipmentService.getAllEquipments();
                        })
                        .then((equipments) => this.render(equipments));
                    }
                }
            }
        }
    }

    static render(equipments) {
        this.equipments = equipments;
        $('#app').empty();
        for (let equipment of equipments) {
            $('#app').prepend(
             `<div id="${equipment._id}" class="card">
                 <div class="card-header">
                     <h2>${equipment.name}</h2>
                     <button class="btn btn-danger" onclick="DOMManger.deleteEquipment('${equipment._id}')">Delete</button>
                 </div>
                  <div class="card-body">
                   <div class="card">
                     <div class="row">
                       <div class="col-sm">
                         <input type="text" id="${equipment._id}-sport-name" class="form-control" placeholder="Sport Name">
                          </div>
                          <div class="col-sm">
                        <input type="text" id="${equipment._id}-sport-type" class="form-control" placeholder="Sport Type">
                      </div>
                    </div>
                    <button id="${equipment._id}-new-sport" onclick="DOMManger.addSport('${equipment._id}')"  class="btn btn-ptimary form-control">Add</button>
                   </div>
                 </div>
              </div><br>`
            );
            for (let sport of equipment.sports) {
                $(`#${equipment._id}`).find('.card-body').append(
                    `<p>
                    <span id="name-${sport._id}"><strong>Name: </strong> ${sport.name}</span> 
                    <span id="type-${sport._id}"><strong>Type: </strong> ${sport.type}</span>
                    <button class="btn btn-danger" onclick="DOMManger.deleteSport('${equipment._id}, ${sport._id}')>Delete sport</buttton>`
                );
            }
        }
    }
}

$('#create-new-equipment').click(() => {
    DOMManger.creatEquipment($('#new-equipment-name') .val());
    $('#new-equipment-name').val('');
});

DOMManger.getAllEquipments();
