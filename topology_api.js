const fs = require('fs');

/**
 * A class to represent API to deal with topologies
 * API Functions: 
 *      - readJson: read topology from a json file
 *      - writeJson: write topology to a json file
 *      - queryTopologies: get the active topologies in memory
 *      - deleteTopology: delete a topology from memory
 *      - queryDevices: get the devices in a topology
 *      - queryDevicesWithNetlistNode: get the connected devices to a netlist node
 */
class Topology {

    static topologies = [];
    
    /**
     * Read topology from a json file into to the memory
     * @param {String} fileName: The json file to be loaded into memory
     */
    static readJSON(fileName) {
        try {
            const data = fs.readFileSync(fileName);
            this.topologies.push(JSON.parse(data));
            console.log('SUCCESS: File Read');
        }
        catch (err) {
            console.log('ERR: File NOT FOUND');
        }
    }

    /**
     * Write a json file into the disk
     * @param {String} topologyID: The id of the topology to be written into disk
     */
    static writeJSON(topologyID) {
        const topo = this.topologies.find(top => {
            return top.id === topologyID
        });
          
        if (!topo) {
            console.log('ERR: File NOT FOUND');
            return;
        }

        fs.writeFile (topologyID + '.json', JSON.stringify(topo), (err) => {
            if (err) {
                console.log('ERR: File NOT SAVED');
                return;
            }

            console.log('SUCCESS: File Write');
        });
    }

    /**
     * 
     * @returns The ids of the topologies that are currently in memory
     */
    static queryTopologies() {
        const result = this.topologies.map(topo => topo.id);
        return result;
    }

    /**
     * Delete a Topology from the memeory
     * @param {String} topologyID: The id of a topology to be deleted  
     */
    static deleteTopology(topologyID) {
        const idx = this.topologies.findIndex(topo => topo.id === topologyID);
        if(idx < 0) {
            console.log('ERR: Topology NOT FOUND');
            return;
        }

        this.topologies.splice(idx, 1);
        console.log('SUCCEES: Topology Deleted')
    }

    /**
     * Query the devices in a topology
     * @param {String} topologyID: The id of a topology to query its devices
     * @returns List of device types and ids of the given topology   
     */
    static queryDevices(topologyID) {
        const idx = this.topologies.findIndex(topo => topo.id === topologyID);
        if(idx < 0) {
            console.log('ERR: Topology NOT FOUND');
            return [];
        }

        const result = this.topologies[idx].components
        .map(comp => {
            return {type: comp.type, id: comp.id};
        });
        return result;
    }

    /**
     * Query The devices connected to a certain netlist node in a certain topology
     * @param {String} topologyID:  The id of a topology to perform the operation on
     * @param {String} NetlistNodeID: The id of a netlist node to grip connected devices to it
     * @returns List of devices that are connected to a given netlist node in a given topology
     */
    static queryDevicesWithNetlistNode(topologyID, NetlistNodeID) {
        const idx = this.topologies.findIndex(topo => topo.id === topologyID);
        if(idx < 0) {
            console.log('ERR: Topology NOT FOUND');
            return [];
        }

        let result = this.topologies[idx].components
        .map(comp => {
            const netlistValues = Object.values(comp.netlist);
            if (netlistValues.includes(NetlistNodeID))
                return {type: comp.type, id: comp.id};
        });

        result = result.filter( element => {
            return element !== undefined;
        });
        return result;        
    }

 }




module.exports = Topology;
